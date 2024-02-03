import dotenv from 'dotenv';
dotenv.config();
module.export = {
    aws_remote_config: {
        accesskeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    },
    JWT_SECRET: process.env.JWT_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

}