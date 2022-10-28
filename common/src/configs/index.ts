if (!process.env.JWT_SECRET) {
  throw new Error('Missing env variable "JWT_SECRET"');
}

export const configs = {
  JWT_SECRET: process.env.JWT_SECRET,
};
