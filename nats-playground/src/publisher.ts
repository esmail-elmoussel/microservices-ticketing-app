import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected successfully to NATS streaming server!");

  const eventName = "new-user";
  const eventData = {
    username: "Esmail Elmoussel",
    role: "Super Admin",
  };

  stan.publish(eventName, JSON.stringify(eventData), (err, guid) => {
    if (err) {
      console.log("publish failed: " + err);
    } else {
      console.log("published message with guid: " + guid);
    }
  });
});
