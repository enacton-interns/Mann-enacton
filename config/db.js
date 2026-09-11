import mongoose from "mongoose";

async function connect(url){
    mongoose.connect(url).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log(err);
    })
}

export default connect