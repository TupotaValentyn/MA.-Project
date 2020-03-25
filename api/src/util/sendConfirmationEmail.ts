import { SentMessageInfo } from 'nodemailer';
import config from '../config';
import { translate, createMailTransporter } from './index';

export default (email: string, userHash: string): Promise<SentMessageInfo> => {
    const transporter = createMailTransporter();

    const mailOptions = {
        from: `"Rest Finder" <${config.MAIL_USER}>`,
        to: email,
        subject: translate(0, 'Регистрация в системе'),
        html: `
            <h3>Вы успешно зарегистрировались в системе!</h3>
            <a href="http://localhost:3000/auth/verify_email/${userHash}">
                Подтвердить почту
            </a>
        `,
    };

    return transporter.sendMail(mailOptions);
};
