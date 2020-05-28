import { TokenData, UserPublicData } from 'index';

import { sign } from 'jsonwebtoken';
import config from '../config';

export default (userPublicData: UserPublicData): TokenData => {
    const tokenDuration = 60 * 60 * 24 * 7; // 7 days

    const expires = Math.floor(Date.now() / 1000 + tokenDuration);
    const token = sign(userPublicData, config.JWT_SECRET, {
        expiresIn: tokenDuration,
    });

    return { token, expires };
};
