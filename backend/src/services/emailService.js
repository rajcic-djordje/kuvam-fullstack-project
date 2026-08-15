import nodemailer from "nodemailer"
import env from "../config/env.js"

const getTransporter = () => {
    if(!env.smtpHost || !Number.isInteger(env.smtpPort) || !env.smtpUser || !env.smtpPassword || !env.mailFrom)
        throw new Error("Email service is not configured.")

    return nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
            user: env.smtpUser,
            pass: env.smtpPassword
        }
    })
}

const sendPasswordResetCode = async(email, code) => {
    const transporter = getTransporter()

    await transporter.sendMail({
        from: `"Kuvam" <${env.mailFrom}>`,
        to: email,
        subject: "Kuvam - kod za promenu lozinke",
        text: `Tvoj kod za promenu lozinke je ${code}. Kod važi 15 minuta.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
                <h2 style="margin: 0 0 16px;">Promena lozinke</h2>

                <p style="margin: 0 0 18px; line-height: 1.6;">
                    Primili smo zahtev za promenu lozinke na tvom Kuvam nalogu.
                </p>

                <p style="margin: 0 0 10px;">
                    Tvoj kod je:
                </p>

                <div style="font-size: 30px; font-weight: 700; letter-spacing: 8px; margin: 0 0 20px;">
                    ${code}
                </div>

                <p style="margin: 0; line-height: 1.6;">
                    Kod važi 15 minuta. Ako nisi tražio promenu lozinke, zanemari ovu poruku.
                </p>
            </div>
        `
    })
}

export {
    sendPasswordResetCode
}