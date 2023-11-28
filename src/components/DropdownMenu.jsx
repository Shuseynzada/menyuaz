import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { languageTexts } from "../constans.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function DropdownMenu({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <button className="dropdown-button" onClick={toggleDropdown}>
        <img className='w-10 inline mr-1' src={languageTexts[language].img} alt={languageTexts[language].label} />
        {languageTexts[language].label}
      </button>
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <div className='absolute left-0 top-0 w-full h-full bg-black opacity-30' onClick={() => setIsOpen(false)}></div>
              <motion.div
                className="modal-overlay absolute z-10 bg-white w-full md:w-[40%] right-0 p-3 shadow-lg"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={toggleDropdown} // This will close the modal when clicking outside
              >
                <div className='flex justify-between p-1'>
                  <h1 className='font-semibold text-[1.2em]'>Menyu dilini seçin</h1>
                  <div onClick={toggleDropdown} className='flex justify-center items-center text-[1.5em] aspect-square'>×</div>
                </div>
                <hr />
                <ul className="language-options">
                  {Object.keys(languageTexts).map((langCode) => (
                    <div key={langCode+"list"}>
                      <li key={langCode} onClick={() => selectLanguage(langCode)} className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <img className='w-10 mr-2' src={languageTexts[langCode].img} alt={languageTexts[langCode].label} />
                          {languageTexts[langCode].header}
                        </div>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </li>
                      <hr />
                    </div>
                  ))}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.getElementById('modal')
      )}
    </>
  );
}

export default DropdownMenu;
