if (!process.env.JWT_SECRET) {
  throw new Error('Missing env variable "JWT_SECRET"');
}

if (!process.env.NODE_ENV) {
  throw new Error('Missing env variable "NODE_ENV"');
}

export const configs = {
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};
