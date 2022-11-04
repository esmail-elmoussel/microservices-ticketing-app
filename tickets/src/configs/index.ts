if (!process.env.JWT_SECRET) {
  throw new Error('Missing env variable "JWT_SECRET"');
}

if (!process.env.MONGO_URI) {
  throw new Error('Missing env variable "MONGO_URI"');
}

export const configs = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
};
