import { SentMessageInfo } from 'nodemailer';

import config from '../config';
import { translateText, createMailTransporter, getTemplateHTML } from './index';
import { User } from '../models';

export default async (user: User, locale: string): Promise<SentMessageInfo> => {
    const transporter = createMailTransporter();

    const html = await getTemplateHTML('password_reset', {
        message: translateText('resetPasswordEmailMessage', locale),
        linkText: translateText('resetPasswordEmailLinkText', locale),
        href: `${config.FRONT_END_URL}/reset_password?userHash=${user.userHash}`,
    });

    const mailOptions = {
        html,
        from: `"Rest Finder" <${config.MAIL_USER}>`,
        to: user.email,
        subject: translateText('resetPasswordEmailTitle', locale),
    };

    return transporter.sendMail(mailOptions);
};
