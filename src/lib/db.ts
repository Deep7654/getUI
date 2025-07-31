import dbConnect from "../db/dbConnect/dbConnect"

const dbConnects =  async()=>{
   await dbConnect();
}

export {dbConnects}