import mongoose from "mongoose";
const connection = {};
async function connect() {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    //That means we have  connections in connection queue
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("use perivouse connection"); //That means the readyState is 1 and we are connected db
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log("New connection");
  connection.isConnected = db.connections[0].readyState;
}
async function disconnect() {
  if (connection.isConnected) {
    // if (process.env.NODE_ENV == "production") {
    //   //we do not need to connect in the production mode  only dev mode
    //   await mongoose.disconnect();
    //   connection.isConnected = false;
    // } else {
      console.log("Not disconnected");
    // }
  }
}
const db = { connect, disconnect };
export default db;
