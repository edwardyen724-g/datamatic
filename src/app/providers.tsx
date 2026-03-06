import React, { createContext, useContext } from 'react';

const MyContext = createContext(null);

export const MyProvider: React.FC = ({ children }) => {
  return <MyContext.Provider value={{}}>{children}</MyContext.Provider>;
};

export const useMyContext = () => useContext(MyContext);