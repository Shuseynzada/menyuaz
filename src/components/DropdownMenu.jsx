import React, { useState } from 'react';
import { languageTexts } from '../constans';
import { az, en, ru, tr } from "../assets"
function DropdownMenu({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [flagDict, setFlagDict] = useState({ "az": az, "en": en, "ru": ru, "tr": tr })
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleClick = (e) => {
    setLanguage(e.target.getAttribute("value"));
    closeDropdown();
  }

  return (
    <div className="dropdown bg-gray-400 p-1">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <img className='w-5 inline mr-1' src={flagDict[language]} onClick={()=>{}} />
        {language}
      </button>
      {isOpen && (
        <ul className="dropdown-content">
          {Object.keys(languageTexts).map((option) => (
            <li key={option + "key"} onClick={handleClick} value={option} className='hover:pointer'><img value={option} className='w-5 inline mr-1' src={flagDict[option]}/>{option}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;
