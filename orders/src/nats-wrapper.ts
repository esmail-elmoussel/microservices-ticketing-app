import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access client before connecting to NATS");
    }

    return this._client;
  }

  connect = (clusterID: string, clientID: string, url: string) => {
    return new Promise<void>((resolve, reject) => {
      this._client = nats.connect(clusterID, clientID, { url });

      this.client.on("connect", () => {
        return resolve();
      });

      this.client.on("error", (err) => {
        return reject(err);
      });
    });
  };
}

export const natsWrapper = new NatsWrapper();
