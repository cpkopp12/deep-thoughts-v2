const express = require('express');
//import Apollo server
const { ApolloServer } = require('apollo-server-express');
//import schema object
const { typeDefs, resolvers } = require('./schemas');
//db connection
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

//create apollo server and set it with our schema
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//express app
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//new instance of an apolloo server with graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate apollo server with express application as middleware
  server.applyMiddleware({ app })

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

//call async func to start apollo server
startApolloServer(typeDefs, resolvers);
