import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function proxy(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.status(405).send('Method not allowed')
  }

  const data = request.body
  const targetUrl = data.url

  const authHeader = request.headers.authorization
  const headers = new Headers()
  if (authHeader) {
    headers.set('Authorization', authHeader)
  }

  const apiResponse = await fetch(targetUrl, {
    method: 'GET',
    headers: headers
  })

  response.status(apiResponse.status).send(await apiResponse.text())
}
