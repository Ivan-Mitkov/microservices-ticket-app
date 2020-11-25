import nats from "node-nats-streaming";
console.clear();
//create client
//in docs is frequently called stan but it's in effect client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

//listen to the connect event
stan.on("connect", () => {
  console.log("Publisher connected to NATS");
  //data to share, can share only strings
  const data = {
    id: "1233",
    title: "concert",
    price: 20,
  };
  //before sending convert to json
  const dataToSend = JSON.stringify(data);
  //call publish function to publish, first argument is the chanel the second data
  //event is often called message in docs
  stan.publish("ticket:created", dataToSend, () => {
    console.log("Event published");
  });
});
