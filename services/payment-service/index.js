import { Kafka } from "kafkajs";

import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Fixed: removed trailing slash
  }),
);
app.use(express.json());

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9094"],
});

const producer = kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Connected to Kafka");
  } catch (error) {
    console.error("Failed to connect to Kafka", error);
  }
};

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;

  const userID = Math.floor(Math.random() * 1000);

  // Kafka producer to send payment successful message

  await producer.send({
    topic: "payment-successful",
    messages: [
      {
        value: JSON.stringify({
          userID,
          cart,
        }),
      },
    ],
  });

  res.status(200).json({ message: "Payment successful", userID });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal Server Error");
});

app.listen(8000, () => {
  connectToKafka();
  console.log("Payment service is being worked on");
  console.log("Payment service is running on port 8000");
});
