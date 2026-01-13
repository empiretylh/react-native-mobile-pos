import React from 'react';
import axios from 'axios';

const CustomerProvider = React.createContext();

const CustomerDataProvider = ({children}) => {
  const [customerData, setCustomerData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getCustomerData = React.useCallback(() => {
    setLoading(true);
    const source = axios.CancelToken.source();

    axios
      .get('/api/customer/', {
        cancelToken: source.token,
      })
      .then(res => {
        setCustomerData(res.data);
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
    const source = getCustomerData();

    return () => {
      if (source) {
        source.cancel('Component unmounted');
      }
    };
  }, [getCustomerData]);

  return (
    <CustomerProvider.Provider value={{customerData, loading, getCustomerData}}>
      {children}
    </CustomerProvider.Provider>
  );
};

const useCustomer = () => React.useContext(CustomerProvider);

// Custom hook for getting customer sales
const useCustomerSales = id => {
  const {customerData, loading, getCustomerData} = useCustomer();

  if (id === 'all') {
    let salesData = [];
    customerData.forEach(item => {
      salesData.push(...item.sales);
    });
    return {salesData, loading, getCustomerData};
  }

  const customer = customerData.find(item => item.id === id);
  let salesData = customer ? customer.sales : [];
  return {salesData, loading, getCustomerData};
};

// Custom hook for computing customer remaining amount
const useCustomerRemainingAmount = () => {
  const {customerData} = useCustomer();
  let salesData = [];
  customerData.forEach(item => {
    salesData.push(...item.sales);
  });

  let total = 0;
  salesData.forEach(item => {
    total +=
      parseInt(item.grandtotal, 10) - parseInt(item.customer_payment, 10);
  });

  return total;
};

export {
  CustomerDataProvider,
  useCustomer,
  useCustomerSales,
  useCustomerRemainingAmount,
};
