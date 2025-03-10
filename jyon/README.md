cd# OurVoice #

## About ##
OurVoice is a social media platform for community discussions and interactions between citizens and representative MPs. It is designed to help foster healthy, informed debates and influence key policy decisions. The aim of this project is to improve UI/UX, add functionalities for users and moderators.

## Wiki
[BitBucket Wiki Home Page](<https://bitbucket.org/jbam8494/soft3888_w16_02_p01/wiki/Home>)

Check out the wiki home page for details about the source code, who we are, and meetings.

## Installation and Local Running
### Required Dependencies
- Nodejs >= 18 for the app
- JDK >= 8 for Dynamodb Local 
- Placeholder AWS credentials and configuration

### AWS Placeholder
The best way to do this is to install the [AWS CLI](<https://aws.amazon.com/cli/>) and run `aws configure`. Then give it placeholder values for Access Key ID and Secret Access Key, and region of `ap-southeast-2` and output format of `json`. It should look like this:
```
AWS Access Key ID: placeholder
AWS Secret Access Key: placeholder
Default region name: ap-southeast-2
Default output format: json
```
This creates the directory `.aws` at (for UNIX based systems) the home directory with 2 files, `config` and `credentials`. The APIs will use these credentials for the local instance of DynamoDB.

### Steps
1. Download and install the required development dependencies above.
2. Clone this repository
3. In the base directory run `npm install`
4. Change into **nextjs-frontend-ui/** and run `npm install --force`.
5. Change into **posts-api/** and run `npm install` and `npx sls dynamodb install --stage dev`
6. Change into **survey-api/** and run `npm install` and `npx sls dynamodb install --stage dev`
7. Change into **user-managment-api/** and run `npm install` & `npx sls dynamodb install --stage dev`

## Local Running
In the **base** directory:

- `npm run ui` for the frontend
- `npm run dev` for the backend

Frontend can be opened at http://localhost:3001/

Backend APIs are available at http://localhost:3000/

- Posts API is at http://localhost:3000/posts-api/
- Survey API is at http://localhost:3000/survey-api/
- User Management API is at http://localhost:3000/user-api/