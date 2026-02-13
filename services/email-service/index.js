import { Kafka } from "kafkajs";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  clientId: "email-service",
  brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "email-service" });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  await consumer.connect();

  await consumer.subscribe({
    topic: "order-successful",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      const { userID, cart, orderID } = JSON.parse(value);

      const dummyMailID = `${Math.floor(Math.random() * 10000)}@email.com`;

      console.log(
        `Email sent to ${dummyMailID} for order ${orderID} of user ${userID} with cart ${JSON.stringify(cart)}`,
      );

      // Kafka producer to send email sent message

      await producer.send({
        topic: "email-successful",
        messages: [
          {
            value: JSON.stringify({
              userID,
              cart,
              orderID,
              email: dummyMailID,
            }),
          },
        ],
      });
    },
  });
};

run().catch(console.error);
