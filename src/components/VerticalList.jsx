import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useFireStore from '../hooks/useFireStore';

const VerticalList = ({ listData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGrid, setIsGrid] = useState('');
  const [collectionName, setCollectionName] = useState(
    listData.choices && listData.choices[0].title
      ? listData.choices[0].title.replace(/[^a-zA-Z0-9]/g, '')
      : listData.title.replace(/[^a-zA-Z0-9]/g, '')
  );
  const imgGrid = useFireStore(collectionName);

  const handleItemClick = (itemName) => {
    setCollectionName(itemName.replace(/[^a-zA-Z0-9]/g, ''));
  };

  const containerVariants = {
    closed: { height: 50 },
    open: { height: 'auto', transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const buttonVariants = {
    closed: { scale: 1 },
    open: { scale: 0.9, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const listVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <div className="bg-yellow-600 border">
      <motion.button
        style={{ width: 100 + "%" }}
        variants={buttonVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        whileHover={{ scale: isOpen ? 1.1 : 1 }}
        whileTap={{ scale: isOpen ? 0.9 : 1 }}
        onClick={() => {
          if (isOpen) {
            setIsGrid('');
            setIsOpen(false);
          } else {
            setIsOpen(true);
          }
          if (!listData.choices) handleItemClick(listData.title);
        }}
      >
        {listData.title}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="bg-yellow-500 p-2"
            style={{ width: 100 + "%" }}
          >
            {!listData.choices ? (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-[10px]" style={{ width: 100 + "%" }}>
                {imgGrid.map((pic, i) => (
                  <motion.img
                    key={'data' + i}
                    className="object-cover aspect-square"
                    src={pic.url}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            ) : (
              listData.choices.map((item, index) => (
                <motion.li
                  style={{ width: 100 + "%" }}
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${isGrid === item.title ? 'bg-yellow-400' : ''}`}
                  onClick={() => {
                    handleItemClick(item.title)
                    isGrid !== item.title ? setIsGrid(item.title) : setIsGrid('');
                  }}
                >
                  <span
                  >
                    {item.title}
                  </span>
                  {isGrid === item.title ? (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-[10px]">
                      {imgGrid.map((pic, i) => (
                        <motion.img
                          key={'data' + i}
                          className="object-cover aspect-square"
                          src={pic.url}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </motion.li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerticalList;
