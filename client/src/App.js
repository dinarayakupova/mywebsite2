import React from 'react'
import './styles/App.scss'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import MenuPage from './pages/MenuPage/MenuPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import ContactUs from './pages/ContactUs/ContactUs'

const App = () => {
  return (
    <Routes>
      <Route element={<HomePage/>} path={'/'}></Route>
      <Route element={<MenuPage/>} path={'/menu'}></Route>
      <Route element={<ContactUs/>} path={'/contact_us'}></Route>
      <Route element={<OrdersPage/>} path={'/orders'}></Route>
    </Routes>

  )
}

export default App

//comment