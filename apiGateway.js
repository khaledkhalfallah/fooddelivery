const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { Kafka } = require('kafkajs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
app.use(express.json());

// ✅ Kafka setup
const kafka = new Kafka({
  clientId: 'api-gateway',
  brokers: ['localhost:9092']
});

// ✅ gRPC client setup (⚠️ ne pas démarrer le service ici !)
const orderProtoPath = './order.proto';
const orderPackageDef = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(orderPackageDef).OrderService;
const orderClient = new orderProto('localhost:50054', grpc.credentials.createInsecure());

// ✅ REST Endpoints
app.get('/orders', (req, res) => {
  orderClient.GetAllOrders({}, (err, response) => {
    if (err) {
      console.error('[gRPC] GetAllOrders Error:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
    res.json(response.orders);
  });
});

app.get('/orders/:id', (req, res) => {
  orderClient.GetOrder({ id: req.params.id }, (err, response) => {
    if (err) {
      console.error('[gRPC] GetOrder Error:', err.message);
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.json(response);
  });
});

app.post('/orders', (req, res) => {
  const orderData = req.body;
  orderClient.CreateOrder(orderData, (err, response) => {
    if (err) {
      console.error('[gRPC] CreateOrder Error:', err.message);
      return res.status(400).json({ error: 'Erreur de création de commande' });
    }
    res.status(201).json(response);
  });
});

// ✅ GraphQL Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ kafka })
});

async function startApollo() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`✅ REST API Gateway: http://localhost:${PORT}`);
      console.log(`✅ GraphQL API: http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage de l\'API Gateway :', error.message);
  }
}

startApollo();
