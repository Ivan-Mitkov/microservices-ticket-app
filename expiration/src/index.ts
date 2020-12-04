import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  //check if env variable is defined

  if (!process.env.NATS_URL) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("ENV Variable Not Found");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("ENV Variable Not Found");
  }
  //connect to ClusterIp service
  // name: auth-mongo-srv
  // ports:
  //   port: 27017
  try {
    //connect to event bus
    //clusterId from infra/k8s/nats-depl.yaml spec: containers: args: ['-cid', 'ticketing'
    //clientId more or less random value
    //url from service in yaml
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    //gracefull shutdown of the client
    //put it in index to be seen easily
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    //intercept server and close client first
    //DOESN't WORK ON WINDOWS
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (error) {
    console.error(error);
  }
};

start();
