import mongoose from "mongoose";

const connectDb = async (url, dbName) => { 
    try {
        await mongoose.connect(
            url,
            {
                dbName
            }
        )
        console.log(`db: ${dbName} online`)
    } catch (err) {
        console.log(`Error al conectar la DB: ${err.message}`)
    }
}

export default connectDb