import React from 'react';
import axios from 'axios';

const SelectedProductProvider = React.createContext();

const SelectedProductProvider = ({children}) => {
  const [selectedProductData, setSelectedProductData] = React.useState([]);

  return (
    <SelectedProductProvider.Provider value={{selectedProductData, setSelectedProductData}}>
      {children}
    </SelectedProductProvider.Provider>
  );
};

const useSelectedProduct = () => React.useContext(SelectedProductProvider);
const setSProduct = (data)=>{
  const {selectedProductData, setSelectedProductData} = useSelectedProduct()

  const item = {id : data.name, qty: data.qty}
  

  setSelectedProductData()
}

export {SelectedProductProvider, useSelectedProduct, getSupplierProducts};
