import express from 'express';

import { BadRequest } from '@curveball/http-errors';
import { TokenData, UserPublicData } from 'index';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '../models';

import {
    generateTokenData,
    generateUserHash,
    getTemplateHTML,
    isValidEmail,
    sendConfirmationEmail,
    translateText,
} from '../util';

import logger from '../logger';

async function signInUsingPassword(request: express.Request, response: express.Response) {
    const requestBody = { email: '', password: '', ...request.body };

    const email = requestBody.email.toString().trim();
    const password = requestBody.password.toString().trim();

    const userByEmail = await User.findOne({
        where: {
            email,
            password: {
                [Op.ne]: null,
            },
        },
    });

    if (!userByEmail) {
        throw new BadRequest(translateText('errors.noUserWithEmail', request.locale));
    }

    const isCorrectPassword = await bcrypt.compare(password, userByEmail.password);

    if (!isCorrectPassword) {
        throw new BadRequest(translateText('errors.wrongPassword', request.locale));
    }

    if (!userByEmail.isConfirmed) {
        return response.json({
            userHash: userByEmail.userHash,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByEmail.id,
        email: userByEmail.email,
        isConfirmed: userByEmail.isConfirmed,
        isAdmin: userByEmail.isAdmin,
        authType: 'local',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
}

async function register(request: express.Request, response: express.Response) {
    const requestBody = { email: '', password: '', ...request.body };

    const email = requestBody.email.toString().trim();
    const password = requestBody.password.toString().trim();

    if (!isValidEmail(email)) {
        throw new BadRequest(translateText('errors.wrongEmail', request.locale));
    }

    if (password.length < 8) {
        throw new BadRequest(translateText('errors.wrongPassword', request.locale));
    }

    const usersWithSameMail = await User.findAll({ where: { email } });

    if (usersWithSameMail.length) {
        throw new BadRequest(translateText('errors.notUniqueEmail', request.locale));
    }

    const salt = await bcrypt.genSalt(3);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userHash = generateUserHash(email);

    await User.create({
        email,
        userHash,
        password: encryptedPassword,
        locale: request.locale,
    });

    try {
        await sendConfirmationEmail(email, userHash, request.locale);
    } catch (error) {
        logger.error(`An error occurred while sending email to ${email}`);
        logger.error(error.message);
    }

    response.json({ userHash });
}

async function checkAccountVerification(request: express.Request, response: express.Response) {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash },
    });

    if (!userByHash) {
        throw new BadRequest(translateText('errors.wrongHash', request.locale));
    }

    if (!userByHash.isConfirmed) {
        return response.json({
            isConfirmed: false,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByHash.id,
        email: userByHash.email,
        isConfirmed: userByHash.isConfirmed,
        isAdmin: userByHash.isAdmin,
        authType: 'local',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
}

async function resendConfirmationEmail(request: express.Request, response: express.Response) {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash },
    });

    if (!userByHash) {
        throw new BadRequest(translateText('errors.wrongHash', request.locale));
    }

    const newUserHash = generateUserHash(userByHash.email);

    await userByHash.update({
        userHash: newUserHash,
    });

    try {
        await sendConfirmationEmail(userByHash.email, newUserHash, request.locale);
    } catch (error) {
        logger.error(`An error occurred while sending email to ${userByHash.email}`);
        logger.error(error.message);
    }

    response.json({ userHash: newUserHash });
}

async function signInUsingGoogle(request: express.Request, response: express.Response) {
    const { token } = request.body;

    if (!token) {
        throw new BadRequest(translateText('errors.wrongGoogleToken', request.locale));
    }

    const userDataResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { sub: userId, email } = userDataResponse.data;

    let userByEmail = await User.findOne({ where: { email } });

    if (userByEmail) {
        userByEmail.googleId = userId;
        userByEmail.isConfirmed = true;

        await userByEmail.save();
    } else {
        userByEmail = await User.create({
            email,
            googleId: userId,
            isConfirmed: true,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByEmail.id,
        email: userByEmail.email,
        isConfirmed: userByEmail.isConfirmed,
        isAdmin: userByEmail.isAdmin,
        authType: 'google',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
}

async function signInUsingFacebook(request: express.Request, response: express.Response) {
    const { accessToken, userId } = request.body;

    if (!accessToken) {
        throw new BadRequest(translateText('errors.wrongFacebookToken', request.locale));
    }

    if (!userId) {
        throw new BadRequest(translateText('errors.wrongFacebookUserId', request.locale));
    }

    const url = `https://graph.facebook.com/v2.6/${userId}?fields=email&access_token=${accessToken}`;

    const fbResponse = await axios.get(url);
    const { email, id } = fbResponse.data;

    let userByEmail = await User.findOne({ where: { email } });

    if (userByEmail) {
        userByEmail.facebookId = id;
        userByEmail.isConfirmed = true;

        await userByEmail.save();
    } else {
        userByEmail = await User.create({
            email,
            facebookId: id,
            isConfirmed: true,
        });
    }

    const userPublicData: UserPublicData = {
        id: userByEmail.id,
        email: userByEmail.email,
        isConfirmed: userByEmail.isConfirmed,
        isAdmin: userByEmail.isAdmin,
        authType: 'facebook',
    };

    const tokenData: TokenData = generateTokenData(userPublicData);

    response.json({ tokenData });
}

async function verifyEmail(request: express.Request, response: express.Response) {
    const { userHash } = request.params;

    const userByHash = await User.findOne({
        where: { userHash },
    });

    if (!userByHash) {
        const pageHTML = await getTemplateHTML('email_confirmed', {
            message: translateText('errors.wrongHash', request.locale),
        });

        return response.send(pageHTML);
    }

    if (userByHash.isConfirmed) {
        const pageHTML = await getTemplateHTML('email_confirmed', {
            message: translateText('errors.emailAlreadyConfirmed', request.locale),
        });

        return response.send(pageHTML);
    }

    await User.update({ isConfirmed: true }, { where: { userHash } });

    const pageHTML = await getTemplateHTML('email_confirmed', {
        message: translateText('emailConfirmed', request.locale),
    });

    response.send(pageHTML);
}

export default {
    signInUsingPassword,
    register,
    checkAccountVerification,
    resendConfirmationEmail,
    signInUsingGoogle,
    signInUsingFacebook,
    verifyEmail,
};
