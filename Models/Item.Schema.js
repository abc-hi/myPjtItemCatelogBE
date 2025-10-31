    import mongoose from "mongoose";

    const itemSchema = new mongoose.Schema({
        id:{
            type:Number,
            required:true, 
            unique:true
        },
        name:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true,
        },
        new_price:{
            type:Number,
            required:true,
        },
        old_price:{
            type:Number,
            required:true, 
        },
    date: {
        type: Date,
        default: () => moment.tz("Europe/Dublin").format("YYYY-MM-DD HH:mm:ss")

    },

    stock:{
        type:Number,
        default:0,
    },
    size:{
    type:[String],
    required:true,
    },
    color:{
        type:[String],
        required:true,
    },
        
    })
    const ItemCatelog = mongoose.model('ItemCatelog',itemSchema)
    export default ItemCatelog;