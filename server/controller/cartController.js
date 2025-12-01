import Cart from '../models/cartModel.js';


// Add to cart controller
export const addTocart = async (req, res) =>{
    try {
        const  userId = req.body;
        const {productId, quantity} = req.body

        let cart = await Cart.findOne({ userId });
        if(!card){
            cart = await Cart.create({
                user: userId,
                cartItems: [{ product: productId, quantity  }]
            });
            return res.status(201).json({ success: true, message: "Product added to cart", cart});
        }
        const itemIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId);

            if(itemIndex > -1){
                cart.cartItems[itemIndex].quantity += quantity;
            }else{
                cart.cartItems.push({ product: productId, quantity });
            }
            cart = await cart.save();
            return res.status(200).json({ success: true, message: "Cart updated", cart});
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

// Get  user cart controller(View cart)

export const getUserCart = async (req, res) =>{
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({user: userId}).populate('cartItems.product');
        if(!cart){
            return res.status(404).json({success: false, message: "Cart not found"});
        }
        return res.status(200).json({ success: true, cart });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

