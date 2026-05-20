const { Resend } = require('resend')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  let data
  try {
    data = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { type, name, email, phone, message, productName, productPrice } = data

  const isRequest = type === 'request'
  const subject = isRequest
    ? `Cerere nouă: ${productName}`
    : `Mesaj nou de la ${name}`

  const html = isRequest
    ? `
      <h2>Cerere nouă pentru lucrare</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold">Lucrare:</td><td style="padding:8px">${productName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Preț:</td><td style="padding:8px">${productPrice} RON</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Nume:</td><td style="padding:8px">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${phone || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Mesaj:</td><td style="padding:8px">${message || '—'}</td></tr>
      </table>
    `
    : `
      <h2>Mesaj nou de pe snaart.ro</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold">Nume:</td><td style="padding:8px">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${phone || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Mesaj:</td><td style="padding:8px">${message}</td></tr>
      </table>
    `

  try {
    await resend.emails.send({
      from: 'SNAART <noreply@snaart.ro>',
      to: ['harataualexandra@gmail.com'],
      reply_to: email,
      subject,
      html,
    })
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Email failed' }) }
  }
}
