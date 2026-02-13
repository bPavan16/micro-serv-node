import { Kafka } from "kafkajs";


// Connect to Kafka broker
const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9094"], 
});

const admin = kafka.admin();

const run = async () => {
  await admin.connect();
  console.log("Admin connected");

  // Create a topic
  await admin.createTopics({
    topics: [{ topic: "payment-successful" }, { topic: "order-successful" },{topic:"email-successful"}],
  });

  console.log("Topic created");
};

run().catch(console.error);