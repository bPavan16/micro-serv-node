# Microservices NodeJs

This workspace contains multiple microservices and a Kafka setup for event-driven communication.

## Structure

- `kafka/` - Kafka broker and UI setup using Docker Compose
- `payment-service/` - Handles payment processing and produces events to Kafka
- `order-service/` - (Add details as implemented)
- `email-service/` - (Add details as implemented)
- `analytic-service/` - Consumes Kafka events for analytics

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for service development)

### Kafka Setup
1. Navigate to the kafka directory:
   ```sh
   cd services/kafka
   ```
2. Start Kafka and Kafka UI:
   ```sh
   docker compose up
   ```
3. Access Kafka UI at [http://localhost:8080](http://localhost:8080)

### Running Services
Each service has its own directory. Example for payment-service:

```sh
cd services/payment-service
npm install
node index.js
```

Repeat for other services as needed.

## Topics
- `payment-successful` - Emitted by payment-service, consumed by analytic-service
- `order-successful` - (Planned)

## Notes
- All services use Kafka for communication. Ensure Kafka is running before starting services.
- Update `.env` files as needed for local configuration.

---

Feel free to extend this README as you add more services or features.
