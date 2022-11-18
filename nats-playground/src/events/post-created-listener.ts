import { Message } from "node-nats-streaming";
import { PostCreatedEvent } from "../types";
import { BaseListener } from "./base-listener";

export class PostCreatedListener extends BaseListener<PostCreatedEvent> {
  readonly subject = "post:created";

  readonly queueGroup = "comment-service";

  onMessage = (data: PostCreatedEvent["data"], msg: Message) => {
    console.log(
      `Got a new message number #${msg.getSequence()} with data: `,
      data
    );

    msg.ack();
  };
}
