import React, { useEffect, useState } from 'react'
import cls from './Header.module.scss'
import { Link } from 'react-router-dom'
import cartSVG from '../../assets/icon/cart.svg'
import bin from '../../assets/icon/bin.svg'
import Modal from '../modal/Modal'
import { loginSlice, logout } from '../../store/reducers/authSlice'
import { useLoginMutation, useRegisterUserMutation } from '../../api/authApi'
import { useDispatch } from 'react-redux'
import { addToCart, clearCart, removeFromCart } from '../../store/reducers/cartSlice'
import CartModal from '../modal/CartModal'
import minus from '../../assets/icon/minus.svg'
import plus from '../../assets/icon/plus.svg'
import { useAddOrdersMutation } from '../../api/cartApi'

const Header = ({ dark }) => {
  const [ user, setUser ] = useState('')
  const [ showModal, setShowModal ] = useState(false)
  const [ showModalCart, setShowModalCart ] = useState(false)
  const [ showModalLogin, setShowModalLogin ] = useState(false)
 //const [ showModalSign, setShowModalSign ] = useState(false)
  const [ showModalProfile, setShowModalProfile ] = useState(false)
  const dispatch = useDispatch() // initialize useDispatch
  const [ cartItems, setCartItems ] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '') : [])
  const [ getCart, setGetCart ] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '') : [])
  const cartData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '') : []
  const totalQuantity = cartData.totalQuantity || 0
  const [ dataCart, setDataCart ] = useState([])
  const [ click, setClick ] = useState(0)
  const [ cart, setCart ] = useState([])
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passwordRegistration, setPasswordRegistration ] = useState('')
  const [ login, {
    data,
    isError
  } ] = useLoginMutation()
  const [ registration, {
    isError: isErrorRegistration,
    isSuccess: isSuccessRegistration,
    error
  } ] = useRegisterUserMutation()
  const [ addOrders, {
    data:StripeData  } ] = useAddOrdersMutation()

  useEffect(() => {
    const storedData = localStorage.getItem('cart')
    if (storedData) {
      const cartData = JSON.parse(storedData)
      setCartItems(cartData.items)
      setDataCart(cartData.items)
      setGetCart(cartData)
    }
  }, [ click ])
  useEffect(() => {
    if (data) {
      dispatch(loginSlice(data))
      console.log(data)
      setUser(data)
    }

  }, [data, dispatch])

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
  const Logout = () => {
    dispatch(logout())
    window.location.reload()
  }
  const changeModeModal = () => {
    setShowModalLogin(false)
    //setShowModalSign(true)
  }

  useEffect(() => {
    if (data) {
      dispatch(loginSlice(data))
      console.log(data)
    }
    setUser(JSON.parse(localStorage.getItem('data')))

  }, [data, dispatch])

  const quantityProduct = (itemId) => {
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array:', cartItems)
      return 0
    }
    const product = cartItems.find((p) => p.id === itemId)
    return product ? product.quantity : 0
  }
  useEffect( ()=>{
    if(StripeData){
       window.open(StripeData?.url, '_blank');
    }
    return
  }, [StripeData])

  const handleLogin = async () => {
    await login({
      email: email,
      password: password
    })
    window.location.reload()
  }
  const handelRegistration = async () => {
    await registration({
      username: name,
      email: email,
      password: passwordRegistration
    })
    if (!isErrorRegistration) {
      await login({
        email: email,
        password: passwordRegistration
      })
      window.location.reload()
    }
  }
  return (
    <>
      <div className={cls.header}>

        <Link className={cls.logo} to={'/'}>Hat Haven</Link>
        <div className={cls.nav}>
          <Link to={'/contact_us'}>Contact Us</Link>
          <Link to={'/menu'}>Menu</Link>
        </div>
        <div className={cls.ButtonDiv}>
          <div>
            <div onClick={() => {
              setShowModalCart(true)
              setClick(prevState => prevState + 1)
            }} className={cls.cartDiv}>
              <img src={cartSVG} alt={'cart'}></img>
              <h3 className={cls.counter}>{totalQuantity}</h3>
            </div>
          </div>
          <div>
            {user ?
              <button onClick={() => setShowModalProfile(true)}
                      className={[ cls.button, dark ? cls.dark : cls.light ].join(' ')}>{user.user.username}</button>
              :
              <button onClick={() => {
                setShowModal(true)
               // setShowModalSign(false)
                setShowModalLogin(true)
              }} className={[ cls.button, dark ? cls.dark : cls.light ].join(' ')}
              >Login</button>
            }
          </div>
        </div>
      </div>
      {showModal &&
        <Modal visible={showModal} setVisible={setShowModal}>
          {showModalLogin ?
            <div>
              <h2>{isError ? 'Login failed' : 'Login'}</h2>
              <div className={cls.modalLoginInput}>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className={cls.input}
                       placeholder={'Email'}/>
                <input onChange={(e) => setPassword(e.target.value)} className={cls.input} placeholder={'password'}
                       type={'password'}/>
              </div>
              <div className={cls.signInButton}>
                <h4>Don't have an account?</h4>
                <button onClick={changeModeModal}>Registration</button>
              </div>
              <button style={{ background: isError && 'red' }} className={cls.loginButton} onClick={handleLogin}>Login
              </button>
            </div>
            :
            <div>
              <h2>{isSuccessRegistration ? 'Registration was successful' : isErrorRegistration ? error.data.errors[0].msg : 'Registration'}</h2>
              <div className={cls.modalSignInput}>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className={cls.input}
                       placeholder={'Email'}/>
                <input onChange={(e) => setName(e.target.value)} value={name} className={cls.input} type={'text'}
                       placeholder={'Username'}/>
                <input onChange={(e) => {
                  setPasswordRegistration(e.target.value)
                }} className={cls.input} placeholder={'Password'} type={'password'}/>
              </div>
              <button
                onClick={handelRegistration}
                style={{ background: isSuccessRegistration ? 'green' : isErrorRegistration ? 'red' : '' }}
                className={cls.loginButton}
              >
                Registration
              </button>
            </div>
          }
        </Modal>
      }
      {showModalProfile &&
        <Modal setVisible={setShowModalProfile} visible={showModalProfile}>
          <div className={cls.userInf}>
            <h1>{user.user.username}</h1>
          </div>
          <div className={cls.menu}>

            <Link to={'/orders'} className={cls.navLink}>My orders</Link>
            <button onClick={() => Logout()} className={cls.navLink}>Log out</button>
          </div>

        </Modal>
      }
      {showModalCart &&
        <CartModal setVisible={setShowModalCart} visible={showModalCart}>
          <h1 className={cls.cartModalTitle}>Cart</h1>

          <div className={cls.cartBlock}>
            <div>
              <div className={cls.cartControlBlock}>
                <h1 className={cls.statusBarTitleDelivery}>My order</h1>
                <img onClick={() => {
                  dispatch(clearCart())
                  setClick(prevState => prevState + 1)
                }} src={bin} alt={'bin'}></img>
              </div>
              <div>
                {dataCart && dataCart.map((item) => (
                  <div className={cls.cardCart}>
                    <img className={cls.image} width={108} src={`http://localhost:10000/api/${item.image}`}
                         alt={item.name}></img>
                    <h5 className={cls.cartCardPrice}>{item.price}.0 $</h5>

                    <h1 className={cls.cartTitle}>{item.name}</h1>
                    {quantityProduct(item.id) > 0 ?
                      <div className={cls.quantityProduct}>
                        <button onClick={() => {
                          handleRemoveFromCart(item.id, item)
                          setClick(prevState => prevState + 1)
                        }}
                                className={cls.buttonAddToCart}>
                          <img width={20} src={minus} alt={'minus'}/>
                        </button>
                        {quantityProduct(item.id)}
                        <button onClick={() => {
                          handleAddToCart(item.id, item)
                          setClick(prevState => prevState + 1)
                        }} className={cls.buttonAddToCart}>
                          <img width={20} src={plus} alt={'plus'}/>
                        </button>

                      </div> :
                      <button onClick={() => handleAddToCart(item.id, item)} className={cls.buttonAddToCart}>
                        <img width={20} src={plus} alt={'plus'}/>
                      </button>
                    }

                  </div>

                ))

                }
              </div>
            </div>

            <div className={cls.buttonCart}>{dataCart.length ?
              <div onClick={() => {
                addOrders({ orders: dataCart })
                dispatch(clearCart())
                setClick(prevState => prevState + 1)
              }} className={cls.orderButton}>
                <h3>Order / Total</h3>
                <h3>{getCart?.totalPrice}.0 $</h3>
              </div>
              : <div></div>}
            </div>
          </div>

        </CartModal>
      }
      <div>


      </div>
    </>
  )
}

export default Header
