import mongoose from "mongoose";
import ItemCatelog from "./Item.Schema.js";
import User from "./User.Schema.js";


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        //userla irunthu vantha _id
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "ItemCatelog",
                //itemcatelogla irunthu vantha _id
            },
            quantity: {
                type: Number,
                default: 1
            },

        },
    ],

});
const cartItems = mongoose.model("cartItems", cartSchema);
export default cartItems;