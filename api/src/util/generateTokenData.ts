import { TokenData } from 'index';

import { sign } from 'jsonwebtoken';

export default (userPublicData: { id: number, email: string }): TokenData => {
    const tokenDuration = 60 * 60 * 24 * 7;

    const expires = Math.floor(Date.now() / 1000 + tokenDuration);
    const token = sign(userPublicData, process.env.JWT_SECRET, {
        expiresIn: tokenDuration,
    });

    return { token, expires };
}
