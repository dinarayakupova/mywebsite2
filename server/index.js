require('dotenv').config()
const Router = require('./Router/Router')
const admin = require('firebase-admin')
require('firebase/auth')
const path = require('path')

const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 10000
const app = express()

const serviceAccount = require('./serviceAccountKey.json')

const staticDir = path.join(__dirname, 'static')

app.use('/api', express.static(staticDir))

const rootpath = path.join(__dirname, "..");

app.use(express.static(path.join(rootpath, "client/build")));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hat-shop-f27a8-default-rtdb.firebaseio.com/'
})

app.use(
  cors({
    credentials: true,
    origin: [ 'http://localhost:3000', '*' ],
    optionsSuccessStatus: 200,
    methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
    allowedHeaders: [ 'Content-Type', 'Authorization' ]
  })
)
app.use(express.json())
app.use('/api', Router)

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

//add comment 
