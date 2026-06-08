
import ItemCatelog from "../Models/Item.Schema.js";
import User from "../Models/User.Schema.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cartItems from "../Models/Cart.Schema.js";
dotenv.config()

export const createItem = async (req, res) => {
  // http://localhost:5000/api/item/create-item
  try {
    const { id, name, image, category, new_price, old_price, date, stock, size, color } = req.body;
    const itemObj = new ItemCatelog(req.body);
    await itemObj.save()
    res.status(200).json({ message: "the data is created", data: itemObj })
  } catch (error) {
    console.log("error is:", error)
    res.status(500).json({ message: error.message })
  }
}

//getproduct
export const getItem = async (req, res) => {
  //  http://localhost:5000/api/item/get-item
// id:database field name
  try {
    const getObj = await ItemCatelog.find().sort({ id: 1 })
    res.status(200).json({ message: "the products are:", data: getObj })

  } catch (error) {
    console.log("error is", error)
    res.status(500).json({ message: error })
  }
}

//getproduct by id
// http://localhost:5000/api/item/get-itemById/:id

export const getItemById = async (req, res) => {
  try {
    const ItemId = Number(req.params.id);
    const getItem = await ItemCatelog.findOne({ id: ItemId })
    // findById- only if you're querying MongoDB's default _id
    if (!getItem) return res.status(404).json({ message: "Item not found" })
    res.status(200).json({ message: "the product is fetched", data: getItem })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
//update product
//  http://localhost:5000/api/item//update-item/:id

export const updateItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { name, image, category, new_price, old_price, date, stock, size, color } = req.body;

    // findOneAndUpdate -it return updated doc by using new:true
    // updateOne also but need to use fineOne to return since updateOne dont return
    // findoneandupdate-1st arg is Filter,2nd is updateItem,3rs is optional
    // new:true means -return the updated document instead of the original

    const updatedItem = await ItemCatelog.findOneAndUpdate(
      { id: itemId },
      { name, image, category, new_price, old_price, date, stock, size, color },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "The product was updated successfully", timestamp: new Date(), data: updatedItem });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
//deleteproduct

// deleteOne-one arg and that is filter
export const deleteItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    if (!req.params.id || isNaN(itemId)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const deletedItem = await ItemCatelog.deleteOne({ id: itemId })
    if (deletedItem.deletedCount === 0) {
      return res.status(404).json({ message: "the item is not found or already deleted" })
    }
    res.status(200).json({ message: "the product is deleted", data: deletedItem })
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}
export const userRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashPassword })
    await newUser.save()
    res.status(200).json({ message: "Registeration successful", data: newUser })
  } catch (error) {
    res.status(500).json({ error: "Registeration failed, Internal server error" })
  }
}
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: "User Not Found" })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.token = token
    await user.save()
    res.status(200).json({ message: "Login Successful", token: token, username: user.username })
  } catch (error) {
    res.status(500).json({ error: 'login Failed , Internal server error' })
  }
}

// cart apis
// addtocart
export const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId
    const product = await ItemCatelog.findById(productId)
    if (!product) {
      return res.status(200).json({ message: "product is not found" })
    }
    let cart = await cartItems.findOne({ userId });
    if (!cart) {
      cart = new cartItems({ userId, items: [] })
    }
    const existingItem = cart.items.find((item) => item.productId.toString() === productId)
    if (existingItem) {
      existingItem.quantity += 1
    }
    else {
      cart.items.push({
        productId: product._id,
        quantity: 1
      })
    }
    await cart.save()
    res.status(200).json({ message: "Product is added to cart", items: cart.items })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartProducts = await cartItems.findOne({ userId }).populate('items.productId');
    if (!cartProducts) {
      return res.status(200).json({ message: "No products in cart", items: [] })
    }
    return res.status(200).json({ message: "Cart products are:", items: cartProducts.items })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error ", error: error.message })
  }
}
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId
    const product = await ItemCatelog.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "product is not found" })
    }
    let cart = await cartItems.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "cart is empty" })
    }
    const existingItem = cart.items.find((item) => item.productId.toString() === productId)
    if (existingItem) {
      existingItem.quantity -= 1

    }
    else if (existingItem.quantity <= 0)
      return res.status(404).json({ message: "no product" })
    await cart.save()
    res.status(200).json({ message: "Product is removed from cart", items: cart.items })

  } catch (error) {
    res.status(500).json({ message: "Internal server error" })

  }
}