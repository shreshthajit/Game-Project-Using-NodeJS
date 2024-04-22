// Configuration settings for the project
const projectConfig = {
    app: {
        port: parseInt(process.env.PORT) || 3001, // Port on which the server will run
    },
    db: { 
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/skillzy', // MongoDB connection URL
    },
    jwt: {
        key: process.env.JWT_SECRET_KEY || 'secret', // Secret key for JWT (JSON Web Tokens)
        expire: process.env.JWT_COOKIE_EXPIRES_IN || '30d', // JWT expiration duration
    },
    application: {
        baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000', // Base URL for the app
    },
    email: {
        address: process.env.EMAIL_ADDRESS || '',
        password: process.env.EMAIL_PASSWORD || '',
    },
    challenge: {
        questionCount: parseInt(process.env.CHALLENGE_QUESTIONS_COUNT) || 5,
    },
    aws: {
        // apiVersion: process.env.AWS_API_VERSION || 
        bucketName: process.env.S3_BUCKET_NAME || 'skillzy',
        region: process.env.S3_BUCKET_REGION || 'ap-south-1',
        accessKey: process.env.AWS_ACCESS_KEY || '',
        secretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        signatureVersion: process.env.AWS_SIGNATURE_VERSION || 'v4',
    }
};

// Export the project configuration object
module.exports = projectConfig;
