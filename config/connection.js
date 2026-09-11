import mongoose from "mongoose";

const connect = async (URL) => {
    mongoose.connect(URL).then(()=> {
        console.log("Mongodb connected")
    }).catch((err)=> {
        console.log(err.message)
    })
}

export default connect