const admin = require('firebase-admin')
const Stripe  = require('stripe')

class cartController {

  async addOrders (req, res) {
    try {
      const userId = req.user.id
      const userRef = admin.firestore().collection('users').doc(userId)
      const userSnap = await userRef.get()

      if (!userSnap.exists) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      const userData = userSnap.data()
      const { orders: orderCart } = req.body
      const { orders } = userData

      // lets say, orderCart is an array of items
      const newOrders = [ { order: orderCart } ]

      let updatedOrders
      if (orders) {
        if (Array.isArray(orders)) {
          updatedOrders = orders.concat(newOrders)
        } else if (typeof orders === 'object') {
          updatedOrders = [ ...Object.values(orders), ...newOrders ]
        } else {
          throw new Error('Cart error \'orders\' .')
        }
      } else {
        updatedOrders = newOrders
      }
      console.log(...orders)
      const updatedUserData = {
        ...userData,
        orders: updatedOrders
      }

      //connecting to the stripe with the key
      const stripe = Stripe(process.env.STRIPE_KEY)
      //taking data from the cart 
      const lineItems = orderCart.map((product) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: parseInt(product.price) * 100,
          },
          quantity: product.quantity,
        };
      });

      //sending data to the stripe

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/orders',
        cancel_url: 'http://localhost:3000/',
      });



      await userRef.update(updatedUserData)
      return res.send({url:session.url})
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e.message
      })
    }
  }

  async getOrders (req, res) {
    try {
      const userId = req.user.id
      const userRef = admin.firestore().collection('users').doc(userId)
      const userSnap = await userRef.get()

      if (!userSnap.exists) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      const userData = userSnap.data()
      const orders = userData.orders || []

      return res.json(orders)
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e.message
      })
    }
  }

//
}

module.exports = new cartController()
