import React from 'react';
import axios from 'axios';

const SupplierContext = React.createContext();

const SupplierDataProvider = ({children}) => {
  const [supplierData, setSupplierData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getSupplierData = React.useCallback(() => {
    setLoading(true);
    const source = axios.CancelToken.source();

    axios
      .get('/api/supplier/', {
        cancelToken: source.token,
      })
      .then(res => {
        setSupplierData(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          console.log(err);
          setLoading(false);
        }
      });

    return source;
  }, []);

  React.useEffect(() => {
    const source = getSupplierData();

    return () => {
      if (source) {
        source.cancel('Component unmounted');
      }
    };
  }, [getSupplierData]);

  return (
    <SupplierContext.Provider value={{supplierData, loading, getSupplierData}}>
      {children}
    </SupplierContext.Provider>
  );
};

const useSupplier = () => React.useContext(SupplierContext);

// Custom hook for getting supplier products
const useSupplierProducts = id => {
  const {supplierData, loading, getSupplierData} = useSupplier();

  if (id === 'all') {
    let productsData = [];
    supplierData.forEach(item => {
      productsData.push(...item.products);
    });

    return {productsData, loading, getSupplierData};
  }

  const supplier = supplierData.find(item => item.id === id);
  let productsData = supplier ? supplier.products : [];
  return {productsData, loading, getSupplierData};
};

// Custom hook for computing supplier remaining amount
const useSupplierRemainingAmount = () => {
  const {supplierData} = useSupplier();

  let productsData = [];
  supplierData.forEach(item => {
    productsData.push(...item.products);
  });

  let total = 0;

  productsData.forEach(item => {
    let remaing = parseInt(item.cost, 10) * parseInt(item.qty, 10);

    total += remaing - parseInt(item.supplier_payment, 10);
  });

  return total;
};

export {
  SupplierDataProvider,
  useSupplier,
  useSupplierProducts,
  useSupplierRemainingAmount,
};
