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
  NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
  NATS_CLIENT_ID: process.env.NATS_CLIENT_ID,
  NATS_URL: process.env.NATS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
};
