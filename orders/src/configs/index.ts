if (!process.env.JWT_SECRET) {
  throw new Error('Missing env variable "JWT_SECRET"');
}

if (!process.env.MONGO_URI) {
  throw new Error('Missing env variable "MONGO_URI"');
}

if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('Missing env variable "NATS_CLUSTER_ID"');
}

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('Missing env variable "NATS_CLIENT_ID"');
}

if (!process.env.NATS_URL) {
  throw new Error('Missing env variable "NATS_URL"');
}

export const configs = {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
  NATS_CLIENT_ID: process.env.NATS_CLIENT_ID,
  NATS_URL: process.env.NATS_URL,
  QUEUE_GROUP_NAME: "orders-service",
};
