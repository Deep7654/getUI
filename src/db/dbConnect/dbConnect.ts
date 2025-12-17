// import mongoose from "mongoose";

// type ConnectionObject = {
//     isConnected ? : number;
// }
// const connect:ConnectionObject = {}

//  const  dbConnect = async ()=>{
//     if(connect.isConnected){
//         console.log("MongoDB is already connected")
//         return
//     }
//     try {
//         console.log("try to  connect db")
//         const connection = await mongoose.connect(`${process.env.DATABASE_URL}`)
//         console.log("MongoDB connected successfully")
//         connect.isConnected = connection.connections[0].readyState;
//         console.log(`mongoDb Connecteed Host : ${connection.connection.host}`)
//     } catch (error) {
//         console.error("Mongo connetion Failed" , error)
//         throw error;
//     }
// }
 
// export default dbConnect;

import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // 1. Check if we have an active connection state
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }

  // 2. Check if Mongoose itself is already connected (handles hot reloads)
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Using existing connection");
      return;
    }
    await mongoose.disconnect();
  }

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL || "", {
       bufferCommands: false, // Important for Vercel timeouts
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("New database connection established");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;