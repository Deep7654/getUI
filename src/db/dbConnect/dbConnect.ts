import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ? : number;
}
const connect:ConnectionObject = {}

 const  dbConnect = async ()=>{
    if(connect.isConnected){
        console.log("MongoDB is already connected")
        return
    }
    try {
        console.log("try to  connect db")
        const connection = await mongoose.connect(`${process.env.DATABASE_URL}`)
        console.log("MongoDB connected successfully")
        connect.isConnected = connection.connections[0].readyState;
        console.log(`mongoDb Connecteed Host : ${connection.connection.host}`)
    } catch (error) {
        console.error("Mongo connetion Failed" , error)
        throw error;
    }
}
 
export default dbConnect;