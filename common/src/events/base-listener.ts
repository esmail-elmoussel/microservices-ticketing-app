import { Message, Stan } from "node-nats-streaming";
import { Event } from "../types/event.types";

export abstract class BaseListener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroup: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  protected ackWait = 5 * 1000;

  private client;

  constructor(client: Stan) {
    this.client = client;
  }

  listen = () => {
    const options = this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroup);

    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroup,
      options
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Got new message on subject ${this.subject} at ${this.queueGroup}`
      );

      const parsedData = this.parseData(msg);

      this.onMessage(parsedData, msg);
    });
  };

  private parseData = (msg: Message) => {
    const data = msg.getData();

    const parsedData =
      typeof data === "string"
        ? JSON.parse(data)
        : JSON.parse(data.toString("utf-8"));

    return parsedData;
  };
}
