import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../ui/Layout/Layout'
import { useAddProductsMutation, useDeleteProductMutation, useGetProductsQuery } from '../../api/productsApi'
import cls from '../HomePage/HomePage.module.scss'
import minus from '../../assets/icon/minus.svg'
import plus from '../../assets/icon/plus.svg'
import bin from '../../assets/icon/bin.svg'
import { addToCart, removeFromCart } from '../../store/reducers/cartSlice'
import { useDispatch } from 'react-redux'
import Modal from '../../ui/modal/Modal'

const MenuPage = () => {
  const {
    data,
    isLoading,
    isError
  } = useGetProductsQuery()
  const dispatch = useDispatch() //  useDispatch hook is initialized
  const [ cart, setCart ] = useState([])
 // const [ click, setClick ] = useState(0)
  // const cartItems = useSelector((state) => state.auth.cartSlice.items);
  const [ cartItems, setCartItems ] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '') : [])

  const [ userRole, setUserRole ] = useState('USER')
  const [ modal, setModal ] = useState(false)
  const [ name, setName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ price, setPrice ] = useState(0)
  const [ addProducts ] = useAddProductsMutation()
  const [ deleteProduct ] = useDeleteProductMutation()
  const [ user, setUser ] = useState()
  const [ isAuthenticated, setIsAuthenticated ] = useState(false)

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }, [ user ])
  useEffect(() => {
    setUser(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') || '') : {})
  }, [])
  const [ fileName, setFileName ] = useState('')
  const [ file, setFile ] = useState(null)
  const [ errorForm, setErrorForm ] = useState(false)
  const fileInputRef = useRef()
  const inputFileRef = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFile(file)

    if (file) {
      setFileName(file.name)
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }
  
  useEffect(() => {
    if (user?.user?.roles) {

      setUserRole(user.user.roles[0])
    }
  }, [ user ])

  const handleAddProduct = async () => {

    if (!file || !name || !description || !price) {
      setErrorForm(true)
      return
    }
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('image', file)
    try {
      await addProducts(formData)
      window.location.reload()

    } catch (e) {
      console.error(e) // log any errors
    }
  }
  const handleDeleteProduct = async (id) => {
    try {
      const stringId = id.toString()
      await deleteProduct({ id: stringId })
      window.location.reload()

    } catch (e) {
      console.error(e)
    }
  }
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
   // setClick(prevState => prevState + 1)
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
   // setClick(prevState => prevState + 1)

  }

  const quantityProduct = (itemId) => {
    if (!Array.isArray(cartItems)) {
      return 0
    }
    const product = cartItems.find((p) => p.id === itemId)
    return product ? product.quantity : 0
  }

  return (
    <div>
      <Layout dark={true}>
        <>
          {!isAuthenticated ? (
            <div className={cls.menuPageWarn}>
              <h1>Please register or log in</h1>
            </div>
          ) : (
            <>
            {/*to add product for admin*/}
              {userRole === 'ADMIN' &&
                <div onClick={() => setModal(true)} className={cls.addProduct}>
                  <h1>Add Product</h1>
                  <img src={plus} alt={'plus'} width={30}></img>
                </div>}
                 {/*for regular user*/}.
              <div>{data && <div className={cls.productsBlock}>

                {isLoading & !isError ?
                  <div>loading</div> :
                  <div className={cls.products}>

                   {/*cart display: name, description, image*/}

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

                       {/*quintity from nothing to number*/}


                          {quantityProduct(product.id) > 0 ?
                            <div className={cls.quantityProduct}>
                              <button onClick={() => handleRemoveFromCart(product.id, product)}
                                      className={cls.buttonAddToCart}>
                                <img width={20} src={minus} alt={'plus'}/>
                              </button>
                              {quantityProduct(product.id)}
                              <button onClick={() => handleAddToCart(product.id, product)}
                                      className={cls.buttonAddToCart}>
                                <img width={20} src={plus} alt={'minus'}/>
                              </button>
                            </div> :
                            <button onClick={() => handleAddToCart(product.id, product)}
                                    className={cls.buttonAddToCart}>
                              <img width={20} src={plus} alt={'plus'}/>
                            </button>
                          }
                        </div>
                         {/*to delete for admin*/}.
                        <div>
                          {userRole === 'ADMIN' &&
                            <button onClick={() => handleDeleteProduct(product.id)} className={cls.deleteProduct}><img
                              width={20} src={bin} alt={'bin'}/></button>
                          }
                        </div>
                      </div>

                    ))}
                  </div>
                }
              </div>
              }
              </div>

            {/*for add => modal window to add the product*/}

              <div className={cls.modalBlock}>
                {<Modal style setVisible={setModal} visible={modal}>
                  <h1 className={errorForm && cls.errorForm}>{errorForm ? 'All fields must be completed' : 'Add' +
                    ' Product'} </h1>
                  <div className={cls.blockAddProduct}>
                    <div className={cls.addProductInput}>
                      <input onChange={(e) => setName(e.target.value)}
                             type="text" placeholder={'Name'}/>
                      <input
                        onChange={(e) => setDescription(e.target.value)} type="text" placeholder={'Description'}/>
                      <input
                        onChange={(e) => setPrice(parseFloat(e.target.value))} type="number"
                        placeholder={'Price'}/>
                      <div onClick={handleClick} ref={inputFileRef}
                           className={cls.inputFileBlock}
                      >
                        <div className={cls.inputfile}>
                          <button>
                            {fileName ? `Selected File: ${fileName}` : 'Select image'}
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          className={cls.input}
                          onChange={handleFileChange}
                          accept="image/jpeg,image/jpg, image/png, image/gif"
                          type="file"
                        />
                      </div>
                    </div>
                    <button onClick={handleAddProduct} className={cls.addProductButton}>Add product</button>
                  </div>
                </Modal>}
              </div>
            </>
          )}
        </>

      </Layout>
    </div>
  )
}

export default MenuPage
