import React from 'react'
import { loaderlogo } from '../assets'
import "../css/PreLoader.css"

function PreLoader() {

    return (
        <div className='fixed w-[100%] h-[100%] bg-black left-0 top-0 flex justify-center items-center bg-white'>
            <div className='absolute w-[300px] rounded-[50%] spinner aspect-square flex justify-center items-center z-[20] overflow-hidden'>
                <div className='absolute bottom-0 w-[40px] h-[15px] bg-black '></div>
                <div className='absolute top-0 w-[40px] h-[15px] bg-black '></div>
            </div>
            <div className='loader-line1 absolute w-[280px] aspect-square flex justify-center aspect-sqaure z-[10]'>
            </div>
            <img src={loaderlogo} className='w-[300px] pulsing' />
        </div>
    )
}

export default PreLoader
