import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema= new mongoose.Schema({
    title: {type: String,required:true},
    description: {type: String,required:true},
    price: { type: Number,required:true,min:1},
    thumbnail: {type: String,required:true},
    code: {type: String,required:true},
    stock: {type: Number,required:true},
    status:{type: Boolean,required:true},
    category:{ type: String,required:true,enum: ['Sports', 'Technology','Clothing']},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    thumbnail:{ type: String, default:""}
});

productSchema.plugin(mongoosePaginate);
export const ProductModel = mongoose.model(productCollection,productSchema);