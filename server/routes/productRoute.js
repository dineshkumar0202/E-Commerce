import express from "express";
import {
    getAllProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controller/productController.js';

const router = express.Router();

// product routes (CRUD)
router.route('/products')
    .get(getAllProducts).post(addProduct);
router.route('/product/:id')
   .get(getSingleProduct).put(updateProduct).delete(deleteProduct);



export default router;