import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { PostCreatedListener } from "./events/post-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected successfully to NATS streaming server!");

  stan.on("close", () => {
    console.log("NATS connection closed!");

    process.exit();
  });

  new PostCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
