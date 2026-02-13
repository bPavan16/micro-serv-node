import { Kafka } from "kafkajs";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  clientId: "analytic-service",
  brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topics: ["payment-successful", "order-successful", "email-successful"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      switch (topic) {
        case "payment-successful":
          await handlePaymentSuccessful(message);
          break;
        case "order-successful":
          await handleOrderSuccessful(message);
          break;
        case "email-successful":
          await handleEmailSuccessful(message);
          break;
        default:
          console.warn(`Unknown topic: ${topic}`);
      }

      console.log('\n\n');

    },
  });
};

const handlePaymentSuccessful = async (message) => {
  const value = message.value.toString();
  const { userID, cart } = JSON.parse(value);
  console.log(`Analytics: Payment successful for user ${userID} with cart ${JSON.stringify(cart)}`);
};

const handleOrderSuccessful = async (message) => {
  const value = message.value.toString();
  const { orderID, userID, cart } = JSON.parse(value);
  console.log(`Analytics: Order ${orderID} successful for user ${userID} with cart ${JSON.stringify(cart)}`);
};

const handleEmailSuccessful = async (message) => {
  const value = message.value.toString();
  const { userID, cart, orderID, email } = JSON.parse(value);
  console.log(`Analytics: Email sent to ${email} for order ${orderID} of user ${userID} with cart ${JSON.stringify(cart)}`);
};

run().catch(console.error);
