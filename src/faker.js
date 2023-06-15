// Faker para mocking
import { Faker, es , en} from '@faker-js/faker';

const customFaker = new Faker({
    locale:[en], // [es] para ponerlo en español 
});

const {commerce, image, database, string} = customFaker

const generateProduct = () => {
    return{
    _id: database.mongodbObjectId(),
    title: commerce.productName(),
    description: commerce.productDescription(),
    price: parseFloat(commerce.price()),
    thumbnail: image.url(),
    code: string.numeric(4),
    stock: parseInt(string.numeric(2)),
    status: true,
    category: commerce.department(),
    }
}

 export const autoGenerateProducts = async() => {
        // numero de productos que se van a crear 
        const productsNumber = 100
        let products = []
        for (let i = 0; i < productsNumber; i++) {
            const product = generateProduct()
            products.push(product)
        }
        return products
}

// const autoProducts = autoGenerateProducts()
// console.log(autoProducts)