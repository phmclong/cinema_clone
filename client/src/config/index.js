// require("dotenv").config();
console.log("host11", process.env.HOST);
console.log("process env", process.env);
const config = {
  host: process.env.REACT_APP_HOST || "http://localhost:5001",
  // host: process.env.HOST,
};

export default config;
