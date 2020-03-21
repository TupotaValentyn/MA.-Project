import nodeMailer from 'nodemailer';

import config from "../config";

export default (): nodeMailer.Transporter => {
    return nodeMailer.createTransport({
        host: config.MAIL_HOST,
        port: config.MAIL_PORT,
        secure: true,
        auth: {
            user: config.MAIL_USER,
            pass: config.MAIL_PASSWORD,
        }
    });
}
