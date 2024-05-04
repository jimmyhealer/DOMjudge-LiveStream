export const config = {
  runtime: 'edge'
}

export default async function proxy(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const data = await request.json()
  const targetUrl = data.url

  const authHeader = request.headers.get('authorization')
  const apiResponse = await fetch(targetUrl, {
    method: 'GET',
    headers: {
      Authorization: authHeader
    }
  })

  const response = new Response(apiResponse.body, apiResponse)
  response.headers.delete('www-authenticate')

  return response
}
