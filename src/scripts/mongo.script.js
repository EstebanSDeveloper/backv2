import mongoose from "mongoose"
import { ProductModel } from "../daos/models/product.model.js"
import "../config/dbConnection.js";

// funcion para agregar owner a cada producto
const updateProducts = async() =>{
    try {
        const products = await ProductModel.find()
        const adminId = "6441908b905f9d16c42e77c9"
        const result = await ProductModel.updateMany({}, {$set:{owner: adminId}})
        console.log(result)
    } catch (error) {
        console.log(error.message)
    }
}

updateProducts()