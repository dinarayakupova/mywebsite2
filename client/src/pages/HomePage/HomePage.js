import React, { useEffect, useState } from 'react'
import cls from './HomePage.module.scss'
import Layout from '../../ui/Layout/Layout'
import { useGetProductsQuery } from '../../api/productsApi'
import plus from '../../assets/icon/plus.svg'
import minus from '../../assets/icon/minus.svg'
import { useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../../store/reducers/cartSlice'

const HomePage = () => {
  const {
    data,
    isLoading,
    isError
  } = useGetProductsQuery()
  const dispatch = useDispatch() // initialized useDispatch from React Redux for data work
  const [ cart, setCart ] = useState([])
  const [ click, setClick ] = useState(0)
  // const cartItems = useSelector((state) => state.auth.cartSlice.items);
  const [ cartItems, setCartItems ] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '') : [])

// handles data retrieval from local storage and updates cartItems
  useEffect(() => {
    const storedData = localStorage.getItem('cart')
    if (storedData) {
      const cartData = JSON.parse(storedData)
      setCartItems(cartData.items)
    }
  }, [ click ])
  //adding items to the cart
  const handleAddToCart = (itemId, item) => {
    const existingCartItemIndex = cart.findIndex(cartItem => cartItem.items.id === itemId)
    if (existingCartItemIndex !== -1) {
      const updatedCart = [ ...cart ]
      updatedCart[existingCartItemIndex].quantity++
      setCart(updatedCart)
    } else {
      setCart([ ...cart, {
        items: item,
        quantity: 1
      } ])
      setCartItems([ ...cart, {
        items: item,
        quantity: 1
      } ])
    }
    dispatch(addToCart(item))
    setClick(prevState => prevState + 1)
  }

  //removing from cart

  const handleRemoveFromCart = (itemId, item) => {
    const existingCartItemIndex = cart.findIndex(cartItem => cartItem.items.id === itemId)

    if (existingCartItemIndex !== -1) {
      const updatedCart = [ ...cart ]
      updatedCart[existingCartItemIndex].quantity--

      if (updatedCart[existingCartItemIndex].quantity === 0) {
        updatedCart.splice(existingCartItemIndex, 1)
        setCart(updatedCart)
      }
      setCartItems([ updatedCart ])
    }
    dispatch(removeFromCart(item))
    setClick(prevState => prevState + 1)

  }
// calculates the quantity 
  const quantityProduct = (itemId) => {
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array:', cartItems)
      return 0
    }
    const product = cartItems.find((p) => p.id === itemId)
    return product ? product.quantity : 0
  }
  
  return (
    <div onClick={() => setClick(prevState => prevState + 1)}>
      <Layout dark={true}>
        <div className={cls.bgHat}></div>
        <div className={cls.helloBlockName}>
          <div className={cls.helloBlock}>
            <h1>Welcome to Hat Haven,</h1>
            <h2>Your Ultimate Destination for Stylish Headwear!</h2>
          </div>
          <p>Are you ready to elevate your style with the perfect hat? Look no further! At Hat Haven, we're
            passionate about headwear, and we've curated a stunning collection of hats that cater to every
            style, occasion, and personality.</p>
        </div>
        <div className={cls.productsBlockMain}>
          <div>{data ? <div className={cls.productsBlock}>

            {isLoading & !isError ?
              <div>loading</div> :

              <div className={cls.products}>
                
                {data && data.map((product) => (
                  <div className={cls.productCard} key={product.id}>
                    <img className={cls.imageCard} width={300} src={`http://localhost:10000/api/${product.image}`}
                         alt={product.name}></img>
                    <h2 className={cls.cardTitle}>{product.name}</h2>
                    <p className={cls.cardDescription}>{product.description}</p>
                    <div className={cls.bottomCardBlock}>
                      <div className={cls.priceAndGrams}>
                        <h4 className={cls.price}>{product.price}.0 $</h4>
                      </div>

                      {quantityProduct(product.id) > 0 ?
                        <div className={cls.quantityProduct}>
                          <button onClick={() => handleRemoveFromCart(product.id, product)}
                                  className={cls.buttonAddToCart}>
                            <img width={20} src={minus} alt={'plus'}/>
                          </button>
                          {quantityProduct(product.id)}
                          <button onClick={() => handleAddToCart(product.id, product)} className={cls.buttonAddToCart}>
                            <img width={20} src={plus} alt={'minus'}/>
                          </button>
                        </div> :
                        <button onClick={() => handleAddToCart(product.id, product)} className={cls.buttonAddToCart}>
                          <img width={20} src={plus} alt={'plus'}/>
                        </button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            }
          </div> : <div></div>
          }
          </div>
        </div>


      </Layout>
    </div>
  )
}

export default HomePage
