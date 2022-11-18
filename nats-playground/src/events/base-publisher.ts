import { Stan } from "node-nats-streaming";
import { Event } from "../types";

export abstract class BasePublisher<T extends Event> {
  abstract subject: T["subject"];

  private client;

  constructor(client: Stan) {
    this.client = client;
  }

  publish = async (data: T["data"]): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err, guid) => {
        if (err) {
          console.error(`publish failed in ${this.subject} due to: ` + err);

          return reject(err);
        }

        console.log(`published message in ${this.subject} with guid: ` + guid);

        resolve(guid);
      });
    });
  };
}
