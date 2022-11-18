import { PostCreatedEvent } from "../types";
import { BasePublisher } from "./base-publisher";

export class PostCreatedPublisher extends BasePublisher<PostCreatedEvent> {
  readonly subject = "post:created";
}
