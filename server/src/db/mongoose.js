const mongoose = require("mongoose");
const config = require("../config");

// const MONGO_DB_USER = config.mongoUser;
// const MONGO_DB_PASSWORD = config.mongoPassword;
// const MONGO_DB_COLLECTION = config.mongoCollection;
// const MONGO_DB_CLUSTER = config.mongoCluster;
// const MONGO_DB_OPTIONS = config.mongoOptions;

// const connectUri =
//   "mongodb://" +
//   MONGO_DB_USER +
//   ":" +
//   MONGO_DB_PASSWORD +
//   MONGO_DB_CLUSTER +
//   MONGO_DB_COLLECTION +
//   MONGO_DB_OPTIONS;

const mongodbURI = config.mongoURI;
mongoose.connect(mongodbURI, {
  // mongoose.connect(connectUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// const mongoose = require('mongoose');

// const MONGODB_URI = process.env.MONGODB_URI;

// mongoose.connect(MONGODB_URI , {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useCreateIndex: true,
// });
