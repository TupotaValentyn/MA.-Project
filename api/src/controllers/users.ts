import express from 'express';

import { BadRequest } from '@curveball/http-errors';
import { verify } from 'jsonwebtoken';
import { UserPublicData } from 'index';
import bcrypt from 'bcrypt';
import { generateUserHash, sendPasswordResetEmail, translateText } from '../util';
import config from '../config';
import { User } from '../models';

async function getUserByToken(request: express.Request, response: express.Response) {
    const { token } = request.params;

    try {
        const userData = await verify(token, config.JWT_SECRET) as UserPublicData;
        response.json({ userData });
    } catch (error) {
        throw new BadRequest(translateText('errors.wrongAuthToken', request.locale));
    }
}

async function changeLocale(request: express.Request, response: express.Response) {
    const { locale } = request.body;
    const validatedLocale = config.AVAILABLE_LOCALES.includes(locale) ? locale : config.DEFAULT_LOCALE;

    const userModel = await User.findOne({ where: { id: request.user.id } });
    userModel.locale = validatedLocale;
    await userModel.save();

    response.json({ newLocale: validatedLocale });
}

async function resetPassword(request: express.Request, response: express.Response) {
    const { email } = request.body;

    if (!email) {
        throw new BadRequest(translateText('errors.wrongEmail', request.locale));
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new BadRequest(translateText('errors.noUserWithEmail', request.locale));
    }

    const newUserHash = generateUserHash(user.email);

    await user.update({
        userHash: newUserHash,
    });

    await sendPasswordResetEmail(user, request.locale);

    response.json({ sent: true });
}

async function updatePassword(request: express.Request, response: express.Response) {
    const { password, userHash } = request.body;

    if (!(password && userHash)) {
        throw new BadRequest(translateText('errors.wrongRequestParams', request.locale));
    }

    const normalizedPassword = password.toString().trim();

    if (normalizedPassword.length < 8) {
        throw new BadRequest(translateText('errors.wrongPassword', request.locale));
    }

    const user = await User.findOne({ where: { userHash } });

    if (!user) {
        throw new BadRequest(translateText('errors.userNotFound', request.locale));
    }

    const salt = await bcrypt.genSalt(3);
    const encryptedPassword = await bcrypt.hash(normalizedPassword, salt);

    await user.update({
        password: encryptedPassword,
    });

    response.json({ updated: true });
}

export default {
    getUserByToken,
    changeLocale,
    resetPassword,
    updatePassword,
};
