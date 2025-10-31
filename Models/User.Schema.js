    import mongoose from "mongoose";

    const userSchema = new mongoose.Schema({
        email:{
              type:String,
            },
        username:{
    type:String,
    required:true
        },
        password:{
            type:String,
            required:true
        },
        token:{
            type:String,
        }
    })
        const User = mongoose.model("User",userSchema)
        export default User;
