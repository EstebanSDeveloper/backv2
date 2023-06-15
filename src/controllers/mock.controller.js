import { autoGenerateProducts } from "../faker.js"; 

export const mockProducts = async (req,res) => {
    const products = await autoGenerateProducts();
    res.json({ status: "success", payLoad: products });
};
