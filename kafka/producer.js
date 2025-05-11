const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'food-delivery-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected');
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
};

const disconnectProducer = async () => {
  await producer.disconnect();
};

module.exports = {
  connectProducer,
  sendMessage,
  disconnectProducer
};