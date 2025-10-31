// images are kept in cloudinary and diract link is taken as type text inn postman -body-formdata and no local files kept so upload.none is used with multer
import express from 'express';
import { addProductToCart, createItem, deleteItem, getCart, getItem,getItemById,removeFromCart,updateItem, userLogin, userRegister } from '../Controller/Item.Controller.js';
import multer from 'multer';
import userAuthMiddleware from '../Middleware/User.auth.middleware.js';

// multer is middleware to handle form data (in postman if u give image then go with formdata)
// here direct image url from cloudinary is given as type text on form data not type file, so here no need of uploading files locally on backend,so upload.none is useDebugValue.multer is for uploading files

const router = express.Router();
const upload = multer();
// Route for creating item with Cloudinary URL sent as text in form-data

router.post("/create-item", upload.none(), async (req, res) => {
  try {
    await createItem(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/get-item",getItem)
// router.get("/get-itemById/:id",getItemById)
router.get('/get-itemById/:id',getItemById)
router.put("/update-item/:id",upload.none(), async(req,res)=>{
  //http://localhost:5000/api/item/update-item
  try {
    await updateItem(req,res)

  } catch (error) {
        res.status(500).json({ message: err.message });
  }
})
router.delete("/delete-item/:id",deleteItem)
router.post("/register-user",userRegister)
router.post("/login-user", userLogin)

// cartAPIrouter
// router.post("/add-cart/:_id",userAuthMiddleware,addProductToCart)
router.post("/add-cart/:productId",userAuthMiddleware,addProductToCart)
router.get('/get-cart',userAuthMiddleware,getCart)
router.delete("/remove-cart/:productId",userAuthMiddleware,removeFromCart)

export default router;

