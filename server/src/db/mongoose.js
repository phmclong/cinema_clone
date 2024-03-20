const mongoose = require("mongoose");

const keys = require("../keys");
const MONGO_DB_USER = keys.mongoUser;
const MONGO_DB_PASSWORD = keys.mongoPassword;
const MONGO_DB_COLLECTION = keys.mongoCollection;
const MONGO_DB_CLUSTER = keys.mongoCluster;
const MONGO_DB_OPTIONS = keys.mongoOptions;


const connectUri = 'mongodb://' + MONGO_DB_USER + ':' + MONGO_DB_PASSWORD + MONGO_DB_CLUSTER + MONGO_DB_COLLECTION + MONGO_DB_OPTIONS
// mongodb://loversky01:<insertYourPassword>
// @docdb-2023-05-25-02-30-08.cluster-clpydp1mhrmb.ap-southeast-1.docdb.amazonaws.com:27017/
// ?ssl=true&ssl_ca_certs=ap-southeast-1-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false

// const mongodbURI = keys.mongoURI;
// mongoose.connect(mongodbURI, {
mongoose.connect(connectUri, {
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


