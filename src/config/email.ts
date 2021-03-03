import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
    service: "Naver",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

export default smtpTransport;