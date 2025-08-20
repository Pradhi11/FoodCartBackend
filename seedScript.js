
import mongoose from "mongoose";

import { Category,Product } from "./src/models/index.js";
import { categories,products } from "./seedData.js";
import "dotenv/config.js"

async function seeDatabase() {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoryDocs = await Category.insertMany(categories)

        const categoryMap = categoryDocs.reduce((map,category)=>{
            map[category.name] = category._id
            return map
        },{})

        const productWithCategoryId = products.map((product)=>({
            ...product,
            category:categoryMap[product.category],

        }))

        await Product.insertMany(productWithCategoryId)
        console.log("productWithCategoryId sucessfully")
        
    } catch (error) {
        console.error("Error in seeding database",error)
    }finally{
        mongoose.connection.close();
    }
    
}

seeDatabase()