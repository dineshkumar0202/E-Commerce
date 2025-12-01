import Cart from "../models/cartModel.js";

// ADD TO CART
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [{ product: productId, quantity }]
            });
        } else {
            const index = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (index > -1) {
                cart.items[index].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ success: true, cart });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET CART
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        res.status(200).json({
            success: true,
            cart: cart || { items: [] }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            item => item.product.toString() === productId
        );
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ success: true, cart });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({ success: true, cart });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
