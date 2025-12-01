import express from 'express';
import {
    registerUser,
    userLogin
} from '../controller/userController.js';

// Initialize router
const router = express.Router();


// User routes
router.post("/register", registerUser);
router.post("/login", userLogin);


export default router;