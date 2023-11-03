import React from 'react'
import { motion } from "framer-motion"
import Navbar from './Navbar'


export default function Contact() {
  return (
    <div className='p-2 flex flex-col gap-[5px]'>
      <div><span className='font-bold'>Icraçı:</span> Haxverdiyev Ayaz Qurban oğlu</div>
      <div><span className='font-bold'>VÖEN:</span> 3601444032</div>
      <div><span className='font-bold'>Ünvan:</span> Azərbaycan Nəşriyyatı, 1-ci mərtəbə</div>
      <div><span className='font-bold'>Tel:</span> 055 801 03 04 ,  050 801 03 04</div>
      <div><span className='font-bold'>E-mail:</span> menyu.az@gmail.com</div>
    </div>
  )
}
