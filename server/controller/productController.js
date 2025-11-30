import Products from '../models/productModel.js';
import APIHelper from '../helper/APIHelper.js';
// import HandleError from '../helper/handleError.js';


const addProduct = async (req, res) => {
    try {
        const product = await Products.create(req.body);
        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//http://localhost:5000/api/v0/products?key=Shoes
const getAllProducts = async (req, res) => {
    try {
        // const products = await Products.find();
        // console.log(req.query.key);
        const apiHelper = new APIHelper(Products.find(), req.query).search();
        // console.log(apiHelper);
        const products = await apiHelper.query;
        res.status(200).json({ success: true, products });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const getSingleProduct = async(req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const updateProduct = async(req, res) => {
    try {
        const product = await Products.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true,
        })  
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteProduct = async(req, res) => {
    try{
        const product = await Products.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export { getAllProducts, getSingleProduct, addProduct, updateProduct, deleteProduct };