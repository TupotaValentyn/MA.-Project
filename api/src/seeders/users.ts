import logger from '../logger';
import { User } from '../models';

export default async () => {
    logger.info('User - Start');

    const admin = await User.findOne({
        where: { email: 'admin@test.com' }
    });

    if (!admin) {
        await User.create({
            email: 'admin@test.com',
            password: '$2b$04$6cqzfP5tUxf3L0.OEOyYM.ppXshp/cGxDST/NZZh5FPAZYgcJ88om',
            isAdmin: true,
            isConfirmed: true,
        });
    }

    const user = await User.findOne({
        where: { email: 'user@test.com' }
    });

    if (!user) {
        await User.create({
            email: 'user@test.com',
            password: '$2b$04$6cqzfP5tUxf3L0.OEOyYM.ppXshp/cGxDST/NZZh5FPAZYgcJ88om',
            isAdmin: false,
            isConfirmed: true,
        });
    }

    logger.info('User - Done');
};
