import AWS from 'aws-sdk';
import config from '../config/config.js'

// variable to hold db connection
let dbConnection = null;

export default class AssistantDAO {

    //estabished connection with db
    static async InjectDB(conn){
        dbConnection = conn;
    }

    //rest of the function
}
