import { SentMessageInfo } from 'nodemailer';

import config from '../config';
import { translateText, createMailTransporter, getTemplateHTML } from './index';

export default async (email: string, userHash: string, locale: string): Promise<SentMessageInfo> => {
    const transporter = createMailTransporter();

    const html = await getTemplateHTML('email_confirmation', {
        userHash,
        locale,
        serverURL: config.SERVER_URL,
        message: translateText('confirmationEmailMessage', locale),
        buttonText: translateText('confirmationEmailButtonText', locale),
    });

    const mailOptions = {
        html,
        from: `"Rest Finder" <${config.MAIL_USER}>`,
        to: email,
        subject: translateText('confirmationEmailTitle', locale),
    };

    return transporter.sendMail(mailOptions);
};
