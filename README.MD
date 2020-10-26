# Serverless Challenge

Challenge created for the Solvimm Backend Developer job opportunity.



![alt text](https://raw.githubusercontent.com/solvimm/serverless-challenge/master/Architecture.png)

# Tecnologies

The following technologies were used in the development of this project:

* Node.js/Javascript
* Serverless Framework
* Amazon S3
* AWS Lambda
* Amazon DynamoDB
* Amazon API Gateway

# Functions

A total of 4 Lambda Functions were created for the project:

* ExtractMetadata
* GetMetadata
* GetImage
* InfoImages

These functions can be found in the ```handler.js``` file, and are used to retrieve information from DynamoDB and Amazon S3.

### ExtractMetadata

This Lambda Function is called automatically when an image is uploaded to the specified S3 Bucket. It gets the image's info and upload It to DynamoDB.

##### Possible status codes

* 201 Created
* 500 Internal Server Error

##### On success

Should return a status code of 201.

### GetMetadata

This Lambda Function works alongside the API Gateway, which is used to build Serverless HTTP Endpoints. When the gateway receives a GET request at the ```/get-metadata/:s3objectkey``` endpoint, It goes into DynamoDB and retrieves the information of an uploaded image with the informed ```s3objectkey``` that was previously stored.

##### Possible status codes

* 200 OK
* 404 Not Found
* 500 Internal Server Error

##### On success

Should return a status code of 200 and a response body containing a JSON string with the following format:

```
{
    "s3objectkey": string,
    "size": number,
    "type": string
}
```

### GetImage

This Lambda Function is called after a GET request to the ```/get-image/:s3objectkey``` endpoint. It goes into the Amazon S3 bucket and looks for a image with the informed ```s3objectkey```, returning It in Base64 encoding.

##### Possible status codes

* 200 OK
* 404 Not Found
* 500 Internal Server Error

##### On success

Should return a status code of 200 and a response body containing a base64 encoded string.

### InfoImages

This Lambda Function is called after a GET request to the ```/info-images``` endpoint. It goes into DynamoDB and uses a Scan to retrieve information on all images. Then It calculates which of the stored images is the biggest (in file size), which is the smallest and returns this information alongside a list of all the image formats stored in the database and a counter of how many images of each format there are in total.

##### Possible status codes

* 200 OK
* 500 Internal Server Error

##### On success

Should return a status code of 200 and a response body containing a JSON string with the following format:

```
{
    "biggestImage": string,
    "smallestImage": string,
    "imageTypes": string[],
    "imageCount": {
        <!-- Contains all image types found as the object attributes -->
        "png": number,
        "jpg": number
    }
}
```

# Running the Project

In order to run the project you should go into the ```.env.example``` file and fill the environment variables with neccessary information, then rename the file to ```.env```.
The project uses a plugin called ```serverless-dotenv-plugin``` to get all environment variables from the ```.env``` file and pass It to the ```serverless.yml``` file, which then is used to deploy to AWS everything that is neccessary for you to access the endpoints and Lambdas.

Next, install the Serverless Framework npm package If you don't already have It. You can use the ```npm i -g serverless``` to install It globally. Also run ```npm i``` in the root folder to install the project dependencies.

When done, run the ```serverless deploy``` command while still at the root folder where the ```serverless.yml``` is located and wait for It to finish deploying the project.

That's It, now you can go ahead and test all the funcionalities! :+1:
