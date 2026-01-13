import React from 'react';
import axios from 'axios';

const SelectedProductContext = React.createContext();

const SelectedProductProvider = ({children}) => {
  const [selectedProductData, setSelectedProductData] = React.useState([]);

  return (
    <SelectedProductContext.Provider value={{selectedProductData, setSelectedProductData}}>
      {children}
    </SelectedProductContext.Provider>
  );
};

const useSelectedProduct = () => React.useContext(SelectedProductContext);
const setSProduct = (data)=>{
  const {selectedProductData, setSelectedProductData} = useSelectedProduct()

  const item = {id : data.name, qty: data.qty}
  

  setSelectedProductData()
}

export {SelectedProductProvider, useSelectedProduct, setSProduct};
