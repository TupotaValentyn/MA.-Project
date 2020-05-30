import express from 'express';
import { BadRequest, Forbidden } from '@curveball/http-errors';
import { ReviewModel } from 'index';
import { translateText } from '../util';

import { RestPlace, Review, User } from '../models';

async function getReviews(request: express.Request, response: express.Response) {
    const { placeId } = request.query;

    if (!placeId) {
        throw new BadRequest(translateText('errors.wrongRequestParams', request.locale));
    }

    const reviews = await Review.findAll({
        attributes: ['id', 'comment', 'created', 'rating'],
        where: { restPlaceId: placeId },
        include: [{
            model: User,
            attributes: ['id', 'email'],
        }],
    });

    response.json({ reviews });
}

async function addReview(request: express.Request, response: express.Response) {
    const { placeId, comment, rating } = request.body;
    const { user } = request;

    const isValidPlaceId = typeof placeId === 'number' && placeId > 0;
    const isValidComment = typeof comment === 'string' && comment.length >= 5 && comment.length <= 1000;
    const isValidRating = typeof rating === 'number' && rating >= 1 && rating <= 5;

    if (!(isValidPlaceId && isValidComment && isValidRating)) {
        throw new BadRequest(translateText('errors.wrongRequestParams', request.locale));
    }

    const place = await RestPlace.findOne({
        where: { id: placeId },
    });

    if (!place) {
        throw new BadRequest(translateText('errors.placeNotFound', request.locale));
    }

    const review = await Review.create({
        comment,
        rating,
        userId: user.id,
        restPlaceId: place.id,
        created: Math.floor(Date.now() / 1000),
    });

    await place.update({
        totalRating: place.totalRating + rating,
        reviewsCount: place.reviewsCount + 1,
    });

    const reviewAuthor = await review.$get('user');

    const reviewModel: ReviewModel = {
        id: review.id,
        comment: review.comment,
        rating: review.rating,
        created: review.created,
        user: {
            id: reviewAuthor.id,
            email: reviewAuthor.email,
        }
    };

    response.json({
        review: reviewModel,
        placeReviewCount: place.reviewsCount,
        placeMeanRating: place.totalRating / place.reviewsCount,
    });
}

async function removeReview(request: express.Request, response: express.Response) {
    const { reviewId } = request.body;
    const { user } = request;

    if (!reviewId) {
        throw new BadRequest(translateText('errors.wrongRequestParams', request.locale));
    }

    const review = await Review.findOne({
        where: { id: reviewId },
        include: [User, RestPlace],
    });

    if (!review) {
        throw new BadRequest(translateText('errors.reviewNotFound', request.locale));
    }

    if (!(review.user.id === user.id || user.isAdmin)) {
        throw new Forbidden(translateText('errors.actionIsForbidden', request.locale));
    }

    await review.destroy();

    await review.restPlace.update({
        totalRating: review.restPlace.totalRating - review.rating,
        reviewsCount: review.restPlace.reviewsCount - 1,
    });

    return response.json({
        removed: true,
        placeReviewCount: review.restPlace.reviewsCount,
        placeMeanRating: review.restPlace.reviewsCount > 0 ? review.restPlace.totalRating / review.restPlace.reviewsCount : 0
    });
}

export default {
    getReviews,
    addReview,
    removeReview,
};
