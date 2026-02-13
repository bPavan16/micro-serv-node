import { Kafka } from "kafkajs";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "order-service" });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({
    topic: "payment-successful",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      const { userID, cart } = JSON.parse(value);

      const dummmyOrderID = Math.floor(Math.random() * 10000);

      console.log(
        `Order ${dummmyOrderID} created for user ${userID} with cart ${JSON.stringify(cart)}`,
      );

      // Kafka producer to send order created message
      await producer.send({
        topic: "order-successful",
        messages: [
          {
            value: JSON.stringify({ orderID: dummmyOrderID, userID, cart }),
          },
        ],
      });
    },
  });
};

run().catch(console.error);
