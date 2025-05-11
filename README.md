Ce projet est une application de démonstration de type **Food Delivery** Il simule un service de livraison de nourriture comportant plusieurs microservices basée sur une architecture de microservices.
Il utilise les technologies suivantes :

- **Node.js** (Express.js, ApolloServer)
- **gRPC** pour la communication entre services
- **Kafka** pour la communication asynchrone
- **GraphQL** et **REST API** via une API Gateway
- **Zookeeper (prérequis pour Kafka)
 ├── apiGateway.js # Passerelle API REST et GraphQL
 une API Gateway qui expose des endpoints REST pour gérer les commandes via gRPC et fournit une interface GraphQL via Apollo Server.
Il inclut aussi une connexion à Kafka pour la gestion des messages ou événements,
bien que l'intégration Kafka ne soit pas encore utilisée directement dans les endpoints REST.
├── orderService.js # Microservice de gestion des commandes (gRPC + Kafka)
un serveur gRPC pour gérer un service de commandes avec des fonctionnalités comme la récupération, la création et la mise à jour du statut des commandes.
 Les commandes sont stockées en mémoire et des événements relatifs aux commandes sont envoyés via Kafka (par exemple, lorsque de nouvelles commandes sont créées ou que leur statut est modifié).
 Ce serveur gRPC écoute sur le port 50054 et offre une interface pour interagir avec les commandes.
├── restaurantService.js # Microservice de gestion des restaurants (gRPC)
Ce fichier configure un serveur gRPC pour gérer un service des restaurants avec des fonctionnalités comme la récupération d'un restaurant par ID,
la récupération de tous les restaurants, et la création de nouveaux restaurants. Les restaurants sont stockés en mémoire et chaque restaurant créé reçoit un ID unique.
 Le serveur gRPC écoute sur le port 50053 et offre une interface pour interagir avec les données des restaurants.
├── order.proto # Définition gRPC des commandes
Ce fichier définit un service OrderService permettant de gérer les commandes dans un système de livraison. Le service propose des opérations telles que récupérer une commande,
récupérer toutes les commandes, créer une nouvelle commande, et mettre à jour le statut d'une commande. Les messages OrderRequest, OrderResponse
├── schema.js # Schéma GraphQL
Ce schéma GraphQL définit les types nécessaires pour gérer les restaurants, les menus, et les commandes.
 Il permet d'effectuer des requêtes pour obtenir des informations sur les restaurants et les commandes, ainsi que des mutations pour créer de nouveaux restaurants,
commandes, ou mettre à jour le statut des commandes. Ce schéma fournit une interface complète pour interagir avec les données des restaurants et des commandes via GraphQL.
├── resolvers.js # Résolveurs GraphQL
Ce fichier définit les résolveurs GraphQL pour gérer les restaurants et les commandes. Il permet de récupérer, créer et mettre à jour des restaurants et des commandes.
 Les événements de mise à jour sont envoyés via Kafka, et les commandes sont liées aux restaurants correspondants.
├──kafka
├──consumer.js
Ce fichier configure un consommateur Kafka pour écouter les messages d'un topic spécifique.
 Il se connecte au serveur Kafka, s'abonne au topic,et exécute un gestionnaire de messages à chaque réception de message
├──producer.js
Ce fichier configure un producteur Kafka pour envoyer des messages à un serveur Kafka.
 Il initialise une connexion avec Kafka, envoie des messages à un topic spécifié, et inclut des fonctions pour se connecter et se déconnecter proprement.
Les messages envoyés sont sérialisés en JSON avant d'être envoyés

Prérequis

- Node.js (v18+ recommandé)
- Apache Kafka et Zookeeper (installé localement)
- Git (pour cloner le projet)
