module.exports.ok = (body, isBase64Encoded = false) => ({
  statusCode: 200,
  body:  body || 'OK',
  isBase64Encoded
})

module.exports.created = () => ({
  statusCode: 201,
  body: 'Created'
})

module.exports.not_found = message => ({
  statusCode: 404,
  body: message || 'Not Found'
})

module.exports.internal_server_error = () => ({
  statusCode: 500,
  body: 'Internal Server Error'
})
