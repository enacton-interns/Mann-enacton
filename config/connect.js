import mongoose from "mongoose"

async function connect(url) {
    try {
        await mongoose.connect(url)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("MongoDB connection failed:", error)
        process.exit(1)
    }
}

export default connect