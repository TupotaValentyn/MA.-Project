import crypto from 'crypto';

export default (email: string): string => {
    const dataToEncrypt = {
        email,
        r: Math.random(),
    };

    return crypto
        .createHash('sha256')
        .update(JSON.stringify(dataToEncrypt))
        .digest('hex');
};
