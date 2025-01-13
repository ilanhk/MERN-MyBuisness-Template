import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import Product, { IProduct } from '../models/productModel';
import redisClient from '../redis';
import { getRedisWithId, getRedisAll } from '../utils/redisFunctions';

const redis_expiry = 86400 //24hours in seconds

const pageSize = parseInt(process.env.PAGINATION_LIMIT || '10')

declare module 'express' {
  interface Request {
    product?: IProduct
  }
}; 

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = 10; // Adjust as needed
    
    const keyword = req.query.keyword +'' || ''; // Get the keyword from query
    
    // Get all products from Redis or database
    const products: IProduct[] = await getRedisAll('products', Product, redis_expiry);
  
    // Filter products based on the keyword
    const filteredProducts = products.filter(product =>
      product.name?.toLowerCase().includes(keyword.toLowerCase())
    );
  
    // Apply pagination using slice
    const selectedProducts = filteredProducts.slice(
      pageSize * (page - 1),
      pageSize * page
    );
  
    // Return paginated products and meta information
    return res.json({
      selectedProducts,
      page,
      pages: Math.ceil(filteredProducts.length / pageSize),
    });
  });
// const getProducts = asyncHandler(async (req: Request, res: Response) => {
    
//     const page = Number(req.query.pageNumber) || 1;

//     const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' }} : {};
//     // { $regex: req.query.keyword, $options: 'i' } use regular expression instead on matching it directy so if type keyword 'phone' it will give us 'iphone 10', 
//     //$options: 'i' means case insensative

//     const count = await Product.countDocuments({...keyword}); // countDocuments() is a mongoose method. In this case it will count how much products in the db
    
  
//     const products = await getRedisAll('products', Product, redis_expiry);
//     const selectedProducts = products.find(product => product.name.toLowerCase() === keyword?.name.toLowerCase())
//         .limit(pageSize)
//         .skip(pageSize * (page - 1));

//     // const selectedProducts = await Product.find({...keyword}) // {} in find will get all of them
//     //     .limit(pageSize)
//     //     .skip(pageSize * (page - 1));

//     return res.json({selectedProducts, page, pages: Math.ceil(count / pageSize)}); // Math.ceil is to round up
// });
// need to use async because getting data from the DB


// @desc Fetch a product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await getRedisWithId('product', productId, Product, redis_expiry);
    
    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    };
});


// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        supplierPrice: 0,
        image: '/images/sample.jpg',
        supplier: 'Sample supplier',
        category: 'Sample category',
        description: 'Sample description',
        isChosen: false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct); 
});


// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, price, description, image, supplier, supplierPrice, category, isChosen } = req.body;

    const productId = req.params.id;
    const product = await getRedisWithId('product', productId, Product, redis_expiry);

    if(product){
        product.name = name;
        product.price = price;
        product.supplierPrice = supplierPrice;
        product.description = description;
        product.image = image;
        product.supplier = supplier;
        product.category = category;
        product.isChosen =  isChosen;

        const updatedProduct = product.save();
        await redisClient.set(`product:${productId}`, JSON.stringify(updateProduct), { EX: redis_expiry });
        return res.json(updatedProduct);

    } else {
        res.status(404);
        throw new Error('Resource not found');
    };
});


// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
   
    const product = await Product.findById(req.params.id);

    if(product){
        const productId = product._id
        await Product.deleteOne({ _id: productId});
        const keysToDelete: string[] = [`product:${productId}`, 'products'];
        await redisClient.del(keysToDelete);
        res.status(200).json('Product deleted')

    } else {
        res.status(404);
        throw new Error('Product not found');
    };
});




export { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
};
