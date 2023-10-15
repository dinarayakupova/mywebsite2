import React, { useEffect } from 'react'
import Layout from '../../ui/Layout/Layout'
import { useGetOrdersMutation } from '../../api/cartApi'
import cls from './OrdersPage.module.scss'

const OrdersPage = () => {
  const [ getOrders, { data = [] } ] = useGetOrdersMutation()

  //the orders we made before are fetched
  useEffect(() => {
    const fetchData = async () => {
      await getOrders()
    }
    fetchData()
  }, [getOrders])
  return (
    <div>
      <Layout dark={true}>
        <div className={cls.orderInfBlock}>
          <div className={cls.ordersBlock}>
            <h1>My orders</h1>
            <div className={cls.ordersCard}>
              {
                data &&
                data.map((orderGroup, index) => {
                  console.log()
                  return (
                    <div className={cls.orderCard} key={index}>
                      <div className={cls.imageOrderBlock}>
                        {orderGroup.order.map((product) => (
                          <div className={cls.orderCards}>
                            <img
                              className={cls.imgOrder}
                              src={`http://localhost:10000/api/${product.image}`}
                              alt={product.name}
                            />
                            <div className={cls.orderInf}>
                              <h2>{product.name}</h2>
                              <p>{product.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <h2 className={cls.orderStatus}>Delivered</h2>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>

       
      </Layout>
    </div>
  )
}

export default OrdersPage
