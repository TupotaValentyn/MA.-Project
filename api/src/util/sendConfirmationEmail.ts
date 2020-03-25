import { SentMessageInfo } from 'nodemailer';

import config from '../config';
import { translate, createMailTransporter, getTemplateHTML } from './index';

export default async (email: string, userHash: string): Promise<SentMessageInfo> => {
    const transporter = createMailTransporter();

    const html = await getTemplateHTML('email_confirmation', { userHash });

    const mailOptions = {
        html,
        from: `"Rest Finder" <${config.MAIL_USER}>`,
        to: email,
        subject: translate(0, 'Регистрация в системе'),
    };

    return transporter.sendMail(mailOptions);
};
