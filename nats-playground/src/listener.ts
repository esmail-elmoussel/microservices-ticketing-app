import nats, { Message } from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected successfully to NATS streaming server!");

  const eventName = "new-user";

  const subscription = stan.subscribe(eventName);

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data !== "string") {
      return;
    }

    console.log(
      `GOT NEW MESSAGE NUMBER #${msg.getSequence()} WITH DATA: ${msg.getData()}`
    );
  });
});
