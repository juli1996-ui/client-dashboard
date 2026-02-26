// Netlify Function — proxies Instantly API to avoid CORS issues in the browser
exports.handler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    }
  }

  // Rebuild the Instantly API path
  // event.path = /instantly-proxy/api/v2/campaigns/analytics
  const apiPath = event.path.replace('/instantly-proxy', '')
  const query = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : ''

  const targetUrl = `https://api.instantly.ai${apiPath}${query}`
  const authHeader = event.headers['authorization'] || event.headers['Authorization']

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: event.body || undefined,
    })

    const data = await response.text()

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
