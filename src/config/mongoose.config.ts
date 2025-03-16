const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
export const MONGO_DATASTORE = process.env.MONGO_DATASTORE;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
export const URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_DATASTORE}.3mcie.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=${MONGO_DATASTORE}`;
