import React from 'react'
import Header from '../Header/Header'
import cls from './Layout.module.scss'

const Layout = ({
  children,
  dark
}) => {
  return (
    <div className={cls.MainLayout}>
      <Header dark={dark}/>
      <div className={cls.Layout}>{children}</div>
    </div>
  )
}

export default Layout
