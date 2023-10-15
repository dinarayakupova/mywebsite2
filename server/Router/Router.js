const Router = require('express')
const router = new Router()
const authController = require('../controllers/authController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const { check } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const multer = require('multer')
const upload = multer()
router.post(
  '/registration',
  authController.registration
)
router.post('/login', authController.login)

router.post('/products/add', upload.single('image'), productController.addProduct)
router.post('/products/delete', productController.deleteProduct)
router.get('/products', productController.getAllProducts)

router.post('/cart/orders', authMiddleware, cartController.addOrders)
router.get('/cart/orders/get', authMiddleware, cartController.getOrders)

module.exports = router
