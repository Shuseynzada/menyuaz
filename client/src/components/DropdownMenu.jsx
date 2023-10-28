import React, { useState } from 'react';
import { languageTexts } from '../constans';

function DropdownMenu({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleClick = (e) => {
    setLanguage(e.target.textContent);
    closeDropdown(); // Close the dropdown after selecting an option
  }

  console.log()

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        {language}
      </button>
      {isOpen && (
        <ul className="dropdown-content">
          {Object.keys(languageTexts).map((option) => (
            <li key={option + "key"} onClick={handleClick} className='hover:pointer'>{option}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;
