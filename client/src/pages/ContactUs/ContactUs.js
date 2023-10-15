import React from 'react'
import Layout from '../../ui/Layout/Layout'
import cls from './ContactUs.module.scss'

const ContactUs = () => {
  return (
    <div>
      <Layout dark={true}>

        <div className={cls.mapImgBlock}>
          <div>
            <h1 className={cls.phoneNumber}>Our number: +1 123 321 3123</h1>
            <h1 className={cls.phoneNumber}>Our address: 2353 Rue John Campbell, LaSalle, QC 123 321</h1>
            <div>
              <iframe
               title = "googleMaps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11198.949948281463!2d-73.60449039760739!3d45.434792904518396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91105476528a3%3A0xe7586eb9e4767ce0!2sC%C3%A9gep%20Andr%C3%A9-Laurendeau!5e0!3m2!1sen!2sca!4v1695748377904!5m2!1sen!2sca" 
                className={cls.map}
                style={{
                  border: '0',
                  allowFullScreen: '',
                  loading: 'lazy'
                }}
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

      </Layout>
    </div>
  )
}

export default ContactUs
