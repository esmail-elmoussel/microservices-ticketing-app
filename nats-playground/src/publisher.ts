import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { PostCreatedPublisher } from "./events/post-created-publisher";

console.clear();

const stan = nats.connect("tickets", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected successfully to NATS streaming server!");

  const publisher = new PostCreatedPublisher(stan);

  const eventData = {
    id: "some id",
    title: "TITLE",
    userId: "Esmail",
  };

  await publisher.publish(eventData);
});
