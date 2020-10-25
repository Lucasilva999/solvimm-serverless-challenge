'use strict';

require('dotenv').config()
const env = require('./config/env')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  apiVersion: env.s3.apiVersion,
  region: env.s3.region,
  credentials: {
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey
  }
})
const dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: env.dynamoDb.apiVersion, region: env.dynamoDb.region });
const { makeDynamoDBPutParams, makeDynamoDBScanParams, makeDynamoDBGetParams, makeS3GetObjectParams } = require('./helpers/make-params')
const { ok, created, not_found, internal_server_error } = require('./helpers/http-status')

module.exports.extractMetadata = async event => {
  try {
    const { key: s3objectkey, size } = event.Records[0].s3.object
    const item = {
      s3objectkey: s3objectkey,
      type: s3objectkey.split('.').pop(),
      size
    }
    await dynamoDb.put(makeDynamoDBPutParams(item)).promise()
    return created()
  }
  catch (error) {
    console.log('Error: \n\n' + error)
    return internal_server_error()
  }
}

module.exports.getMetadata = async event => {
  try {
    const { s3objectkey } = event.pathParameters
    const { Item } = await dynamoDb.get(makeDynamoDBGetParams({ s3objectkey })).promise()
    if (!Item) return not_found('No info was found with the informed s3objectkey')
    return ok(JSON.stringify(Item))
  }
  catch (error) {
    console.log('Error: \n\n' + error)
    return internal_server_error()
  }
}

module.exports.getImage = async event => {
  try {
    const { s3objectkey } = event.pathParameters
    const data = await s3.getObject(makeS3GetObjectParams(s3objectkey)).promise()
    return ok(data.Body.toString('base64'), true)
  }
  catch (error) {
    console.log('Error: \n\n' + error)
    if (error.statusCode === 404) return not_found('No image was found with the informed s3objectkey')
    else return internal_server_error()
  }
}

module.exports.infoImages = async () => {
  try {
    const info = await dynamoDb.scan(makeDynamoDBScanParams()).promise()
    if (info.Count === 0) return ok('{}')
    const orderBySizeDesc = info.Items.sort((a, b) => {
      if (a.size > b.size) return -1;
      if (b.size > a.size) return 1
      return 0
    })
    const imageTypes = new Set()
    orderBySizeDesc.forEach(obj => imageTypes.add(obj.type))
    const imageCount = new Object({})
    imageTypes.forEach(type => {
      const typeArray = orderBySizeDesc.filter(obj => obj.type === type)
      imageCount[type] = typeArray.length
    })
    const response = {
      biggestImage: orderBySizeDesc[0].s3objectkey,
      smallestImage: orderBySizeDesc.reverse()[0].s3objectkey,
      imageTypes: [...imageTypes],
      imageCount
    }
    return ok(JSON.stringify(response)) 
  }
  catch (error) {
    console.log('Error: \n\n' + error)
    return internal_server_error()
  }
}
