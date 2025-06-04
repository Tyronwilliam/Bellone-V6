export async function sendVerificationRequest({ identifier: to, url, provider, theme }: any) {
  const { host } = new URL(url)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: `Sign in to ${host}`,
      html: html({ url, host, theme }),
      text: text({ url, host })
    })
  })

  if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))
}

function html({ url, host, theme }: { url: string; host: string; theme: any }) {
  const escapedHost = host.replace(/\./g, '&#8203;.')
  const brandColor = theme?.brandColor || '#346df1'
  const buttonText = theme?.buttonText || '#fff'

  return `
      <body style="background: #f9f9f9;">
        <table style="background: #fff; margin: auto; padding: 20px; border-radius: 10px; max-width: 600px;">
          <tr><td align="center" style="font-size: 20px;">Sign in to <strong>${escapedHost}</strong></td></tr>
          <tr><td align="center"><a href="${url}" style="display:inline-block;padding:10px 20px;background:${brandColor};color:${buttonText};text-decoration:none;border-radius:5px;">Sign in</a></td></tr>
          <tr><td align="center" style="font-size: 14px; color: #555;">If you didn’t request this, ignore this email.</td></tr>
        </table>
      </body>
    `
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\nIf you didn’t request this, ignore this email.`
}
