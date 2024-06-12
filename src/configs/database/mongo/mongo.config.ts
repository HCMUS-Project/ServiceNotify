/**
 * @fileoverview mongo.config - Configuration for mongo database
 */

export default () => ({
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost',
    mongoDb: process.env.MONGO_DB || 'nest',
    mongoUser: process.env.MONGO_USER || '',
    mongoPass: process.env.MONGO_PASS || '',
});
