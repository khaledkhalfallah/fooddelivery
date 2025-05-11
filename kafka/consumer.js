const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'food-delivery-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-service-group' });

const startConsumer = async (topic, messageHandler) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const parsedMessage = JSON.parse(message.value.toString());
        await messageHandler(parsedMessage);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  });
};

const disconnectConsumer = async () => {
  await consumer.disconnect();
};

module.exports = {
  startConsumer,
  disconnectConsumer
};