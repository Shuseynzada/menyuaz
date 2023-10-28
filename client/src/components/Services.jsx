import { faBookOpen, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { services } from '../constans'
import "../css/Services.css"
import { placeholder } from '../assets'
import Modal from "react-modal"

export default function Services() {

    const [currService, setCurrService] = useState(0)
    const [servChoice, setServChoice] = useState(services[0].choices)
    const [selectedChoice, setSelectedChoice] = useState(-1)

    const [imageZoom, setImageZoom] = useState(false)
    const [selectedImage, setSelectedImage] = useState(placeholder)

    const openImage = (pict) => {
        setSelectedImage(pict)
        setImageZoom(true)
    }
    const closeImage = () => {
        setImageZoom(false)
    }

    useEffect(() => {
        setServChoice(services[currService].choices)
    }, [currService])

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 999,
        },
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            backgroundColor: '#fff',
            outline: 'none',
            transition: "all 2s"
        },
    };

    Modal.setAppElement("#root")

    return (
        <div className="items-center p-5">
            <div className="text-[1.5em] flex items-center gap-4 mb-1">
                <FontAwesomeIcon icon={faBookOpen} />
                <span className="font-bold">Xidmətlər</span>
            </div>
            <div className="text-[0.8em] sm:text-[1.2em] services-shadow flex flex-col overflow-y-scroll service-categories">
                <div className="relative h-[3em] w-full flex items-center bg-yellow-500 fixed">
                    {services.map((e, i) => (
                        <div key={`service-type${i}`}
                            className={`w-[25%] h-[100%] p-4 text-center flex justify-center items-center hover:bg-yellow-400 hover:cursor-pointer select-none font-bold ${i == currService ? "bg-yellow-600" : ""}`}
                            onClick={() => { setCurrService(i); setSelectedChoice(-1) }}>
                            {e.title}
                        </div>
                    ))}
                </div>
                <div className='flex overflow-x-scroll gap-2 text-[1rem] mt-2 pb-2 service-categories p-2'>
                    {
                        (servChoice.length > 1) && <div className={`hover:cursor-pointer category-card bg-black whitespace-nowrap text-white py-1 px-2 rounded-lg items-center ${(selectedChoice == -1) ? "bg-yellow-500" : ""}`}
                            onClick={() => { setSelectedChoice(-1) }}>Hamsı
                        </div>
                    }
                    {
                        (servChoice.length > 1) && [...servChoice].map((e, i) => (
                            <div key={`service${i}`}
                                className={`hover:cursor-pointer category-card bg-black whitespace-nowrap text-white py-1 px-2 rounded-lg items-center ${(selectedChoice == i) ? "bg-yellow-500" : ""} `}
                                onClick={() => { setSelectedChoice(i) }}
                            >{e.title}
                            </div>
                        ))
                    }
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 p-2'>
                    {
                        (selectedChoice == -1) ?
                            services[currService].choices.map((choice, j) => {
                                return choice.pictures.map((pict, k) =>
                                    <div
                                        key={`serviceImg${k}`}
                                        className={`aspect-square border-4 bg-cover hover:cursor-pointer hover:opacity-[0.8]`}
                                        style={{ backgroundImage: "url(" + pict + ")" }}
                                        onClick={() => { openImage(pict) }}
                                    >
                                    </div>
                                )
                            })
                            :
                            services[currService].choices[selectedChoice].pictures.map((pict, k) =>
                                <div
                                    className={"aspect-square border-4 bg-cover hover:cursor-pointer hover:opacity-[0.8]"}
                                    style={{ backgroundImage: "url(" + pict + ")" }}
                                    onClick={() => { openImage(pict) }}
                                >
                                </div>
                            )
                    }
                </div>
                <Modal
                    isOpen={imageZoom}
                    onRequestClose={closeImage}
                    style={customStyles}
                    contentLabel="Example Modal"
                    className="sm:w-[80vh] sm:h-[40vw] w-[80vw] h-[40vh]"
                >
                    <button className='absolute right-0 top-0 w-10 text-white bg-black aspect-square border rounded-[50%] z-[1000]'
                        onClick={() => { closeImage() }}><FontAwesomeIcon icon={faX}/></button>
                    <div
                        className={"w-full h-full bg-contain"}
                        style={{ backgroundImage: "url(" + selectedImage + ")", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                    >
                    </div>  
                </Modal>
            </div>
        </div>
    )
}
