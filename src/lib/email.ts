import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const displayName = name || 'Programador/a'

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Programadores Argentina" <${process.env.SMTP_USER}>`,
    to,
    subject: '¡Bienvenido/a al Club Programadores Argentina!',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido al Club</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:rgba(8,12,16,0.85);border:1px solid rgba(208,255,113,0.25);border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1b1e 0%,#2d2e32 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(208,255,113,0.2);">
              <p style="margin:0 0 8px;color:#D0FF71;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Programadores Argentina</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Club Exclusivo</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#D0FF71;">$ Hola, ${displayName}!</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cccccc;">
                Tu suscripción al <strong style="color:#ffffff;">Club Programadores Argentina</strong> fue procesada con éxito. ¡Ya sos parte de nuestra comunidad exclusiva!
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#cccccc;">
                En las próximas horas recibirás una invitación a los canales privados donde vas a encontrar:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 16px;background:rgba(208,255,113,0.05);border:1px solid rgba(208,255,113,0.15);border-radius:8px;margin-bottom:8px;">
                    <p style="margin:0;color:#D0FF71;font-size:13px;">✓ &nbsp;Canales de Networking Exclusivos</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:rgba(208,255,113,0.05);border:1px solid rgba(208,255,113,0.15);border-radius:8px;">
                    <p style="margin:0;color:#D0FF71;font-size:13px;">✓ &nbsp;Oportunidades Laborales Exclusivas</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:rgba(208,255,113,0.05);border:1px solid rgba(208,255,113,0.15);border-radius:8px;">
                    <p style="margin:0;color:#D0FF71;font-size:13px;">✓ &nbsp;Material IT Exclusivo actualizado semanalmente</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:rgba(208,255,113,0.05);border:1px solid rgba(208,255,113,0.15);border-radius:8px;">
                    <p style="margin:0;color:#D0FF71;font-size:13px;">✓ &nbsp;Mentorías Grupales y Sorteos Mensuales</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://programadoresargentina.com/club" style="display:inline-block;background:#D0FF71;color:#0d1117;font-weight:700;font-size:14px;padding:14px 32px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">
                      Ir al Club →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;line-height:1.7;color:#888888;">
                ¿Tenés alguna consulta? Respondé este mail o escribinos a
                <a href="mailto:programadoresargentina@gmail.com" style="color:#D0FF71;">programadoresargentina@gmail.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:11px;color:#555555;">
                © ${new Date().getFullYear()} Programadores Argentina · Podés cancelar tu suscripción en cualquier momento desde tu cuenta de MercadoPago.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })
}
