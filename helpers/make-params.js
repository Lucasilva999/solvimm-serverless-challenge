const env = require('../config/env')

module.exports.makeDynamoDBGetParams = Key => ({ TableName: env.dynamoDb.table, Key })

module.exports.makeDynamoDBPutParams = Item => ({ TableName: env.dynamoDb.table, Item })

module.exports.makeDynamoDBScanParams = () => ({ TableName: env.dynamoDb.table })

module.exports.makeS3GetObjectParams = Key => ({ Bucket: env.s3.bucket, Key })
