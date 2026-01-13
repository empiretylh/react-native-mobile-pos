import React from 'react';

const SelectedProductContext = React.createContext();

const SelectedProductProvider = ({children}) => {
  const [selectedProductData, setSelectedProductData] = React.useState([]);

  return (
    <SelectedProductContext.Provider
      value={{selectedProductData, setSelectedProductData}}>
      {children}
    </SelectedProductContext.Provider>
  );
};

const useSelectedProduct = () => React.useContext(SelectedProductContext);

// Custom hook for adding a product to selected products
const useSetSelectedProduct = () => {
  const {selectedProductData, setSelectedProductData} = useSelectedProduct();

  const addProduct = React.useCallback(
    data => {
      const item = {id: data.name, qty: data.qty};
      setSelectedProductData([...selectedProductData, item]);
    },
    [selectedProductData, setSelectedProductData],
  );

  return {addProduct};
};

export {SelectedProductProvider, useSelectedProduct, useSetSelectedProduct};
