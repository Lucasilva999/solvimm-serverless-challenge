module.exports = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  s3: {
    apiVersion: process.env.S3_API_VERSION,
    region: process.env.S3_REGION,
    bucket: process.env.BUCKET
  },
  dynamoDb: {
    apiVersion: process.env.DYNAMODB_API_VERSION,
    region: process.env.DYNAMODB_REGION,
    table: process.env.DYNAMODB_TABLE
  }
}
