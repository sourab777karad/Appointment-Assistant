// import AWS from 'aws-sdk';
// import {aws_remote_config} from './config/config.js';
import app from './server.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import AssistantDAO from './DAO/AssistantDAO.js';
import firebase from 'firebase-admin';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the JSON file using fs
const serviceAccount = JSON.parse(fs.readFileSync(`${__dirname}/config/appointment-assistant-2c9de-firebase-adminsdk-j926f-b687826473.json`, 'utf8'));

// Initialize Firebase
firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_DATABASE_URL});

mongodb.MongoClient.connect(process.env.MONGO_URI).catch(err => {
    console.error(err.stack);
    process.exit(1);
}).then(async client => {
    await AssistantDAO.InjectDB(client);
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is listening on port ${process.env.PORT}` );
    });
});





// Configure AWS with your access and secret key.
// const { accessKeyId, secretAccessKey, region } = config.aws_remote_config;

// Configure AWS
// AWS.config.update({
//     accessKeyId,
//     secretAccessKey,
//     region
// });
// // Create DynamoDB client
// let dynamoClient;
// try {
//     dynamoClient = new AWS.DynamoDB.DocumentClient();
// } catch (error) {
//     console.error(`Failed to connect to DynamoDB: ${error}`);
//     process.exit(1);
// }

// // Inject the client into the DAO
// try {
//     assistantDAO.InjectDB(dynamoClient);
// } catch (error) {
//     console.error(`Failed to inject DynamoDB client into DAO: ${error}`);
//     process.exit(1);
// }

// Start the server after the connection is established
// try {
//     app.listen(3000, () => {
//         console.log(`server running on port ${process.env.PORT}`);
//     });
// } catch (error) {
//     console.error(`Failed to start server: ${error}`);
//     process.exit(1);
// }

