import mongoose from "mongoose";

const counterSchema = mongoose.Schema({
    name:{type:String, default:0,unique:true},
    sequance_value:{type:Number,default:0}

});

const Counter = mongoose.model("Counter",counterSchema)

export default Counter