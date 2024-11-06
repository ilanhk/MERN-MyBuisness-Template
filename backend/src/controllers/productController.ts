import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import Product, { IProduct } from '../models/productModel';

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

    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' }} : {};
    // { $regex: req.query.keyword, $options: 'i' } use regular expression instead on matching it directy so if type keyword 'phone' it will give us 'iphone 10', 
    //$options: 'i' means case insensative

    const count = await Product.countDocuments({...keyword}); // countDocuments() is a mongoose method. In this case it will count how much products in the db
    
    //we want to limit the count if there is a keyword same with Product.find({...keyword})

    const products = await Product.find({...keyword}) // {} in find will get all of them
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({products, page, pages: Math.ceil(count / pageSize)}); // Math.ceil is to round up
});
// need to use async because getting data from the DB


// @desc Fetch a product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    
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
    res.status(201).json(createdProduct); //201 means something was created
});


// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, price, description, image, supplier, supplierPrice, category, isChosen } = req.body;

    const product = await Product.findById(req.params.id);

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
        res.json(updatedProduct);

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
        await Product.deleteOne({ _id: product._id });
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
