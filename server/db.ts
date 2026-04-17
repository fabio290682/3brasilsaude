import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/bloodbank';
const isProduction = process.env.NODE_ENV === 'production';

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', false);
  mongoose.set('autoIndex', !isProduction);

  return mongoose.connect(mongoUri, {
    dbName: 'bloodbank',
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE ?? 20),
    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE ?? 5),
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}
