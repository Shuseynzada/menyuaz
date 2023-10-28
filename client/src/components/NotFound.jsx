import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { NavLink } from 'react-router-dom'
import {motion} from "framer-motion"
import Navbar from './Navbar'

export default function NotFound() {
  return (
    <>
    <motion.div 
    initial={{transform:"scale(0)"}}
    animate={{transform:"scale(1)", transition:{duration:0.4}}}
    className='p-[4em] min-h-[50vh] font-bold text-[3em] flex justify-center items-center gap-5'>
      Səhifə tapılmadı <FontAwesomeIcon icon={faClock} />
    </motion.div>
    </>
  )
}
