const admin = require('firebase-admin')
const uuid = require('uuid')
const FileService = require('../file/file.service')

class productController {
  async addProduct (req, res) {
    try {
      const {
        name,
        description,
        price
      } = req.body
      const file = req.file
      const id = uuid.v4()
      const fileService = new FileService()
      const imageUrl = fileService.createFile(file)

      const product = {
        id,
        name,
        description,
        price,
        image: imageUrl
      }
      await admin.firestore().collection('products').doc(id).set(product)
      return res.json({ message: 'Product added successfully' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Error adding product' })
    }
  }

  async deleteProduct (req, res) {
    try {
      const productId = req.body.id
      const productRef = admin.firestore().collection('products').doc(productId)

      const productSnap = await productRef.get()

      if (!productSnap.exists) {
        return res.status(404).json({ message: 'Product is not found' })
      }

      await productRef.delete()
      return res.json({ message: `Product is successfully deleted: ${JSON.stringify(productSnap.data())}` })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Something went wrong, try again...' })
    }
  }

  async getAllProducts (req, res) {
    try {
      const products = []
      const snapshot = await admin.firestore().collection('products').get()

      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        })
      })

      res.json(products)
    } catch (e) {
      console.log(e)
      res.status(500).send('An error occurred while retrieving products')
    }
  }
}

module.exports = new productController()
