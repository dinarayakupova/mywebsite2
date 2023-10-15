const { validationResult } = require('express-validator')
const admin = require('firebase-admin')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' })
}

class authController {

  async registration (req, res) {
    try {
      const error = validationResult(req)
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
      }

      const {
        username,
        password,
        email
      } = req.body

      const usersRef = admin.firestore().collection('users')
      const snapshot = await usersRef.where('email', '==', email).get()

      const candidate = snapshot.docs[0]

      if (candidate) {
        return res.status(400).json({ errors: [ { msg: 'Such user exists' } ] })
      }

     const hashPassword = bcrypt.hashSync(password, 7) 
     //(for hashing)
      const userRole = 'USER'
      const tokens = jwt.sign({ email }, 'asdsadadasdads', { expiresIn: '100d' })

      await admin.auth().createUser({
        username: username,
        email: email,
        password: hashPassword,
        roles: [ userRole ],
        orders: [],
        token: tokens
      })

      await usersRef.add({
        username: username,
        email: email,
        password: hashPassword,
        roles: [ userRole ],
        token: tokens,
        orders: []
      })

      return res.status(200).json({ message: 'user has been successfully registered' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Registration error' })
    }
  }

  async login (req, res) {
    try {
      const {
        email,
        password
      } = req.body

      const usersRef = admin.firestore().collection('users')

      const snapshot = await usersRef
        .where('email', '==', email)
        .get()

      if (snapshot.empty) {
        return res
          .status(400)
          .json(`User with this email ${email} does not exist`)
      }

      const userDoc = snapshot.docs[0]
      const userData = userDoc.data()

      const validPassword = bcrypt.compareSync(password, userData.password)
      if (!validPassword) {
        return res.status(400).json('this password is not correct')
      }

      const token = generateAccessToken(userDoc.id, userData.roles)
      userData.accessToken = token

      await userDoc.ref.update({
        accessToken: token
      })

      const userResponse = {
        ...userData,
        id: userDoc.id
      }

      return res.json({
        user: userResponse,
        token
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Login error' })
    }
  }

}

module.exports = new authController()
