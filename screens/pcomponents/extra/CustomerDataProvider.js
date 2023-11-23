import React from 'react';
import axios from 'axios';

const CustomerProvider = React.createContext();

const CustomerDataProvider = ({children}) => {
  const [customerData, setCustomerData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getCustomerData = () => {
    setLoading(true);
    axios
      .get('/api/customer/')
      .then(res => {
        setCustomerData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getCustomerData();
  }, []);

  return (
    <CustomerProvider.Provider value={{customerData, loading, getCustomerData}}>
      {children}
    </CustomerProvider.Provider>
  );
};

const useCustomer = () => React.useContext(CustomerProvider);
const getCustomerSales = id => {
  const {customerData, loading, getCustomerData} = useCustomer();

  if(id == 'all'){
    let salesData = []
    customerData.forEach(item=>{
      salesData.push(...item.sales)
    })
    return {salesData, loading, getCustomerData}
  }

  let salesData = customerData.filter(item => item.id == id)[0].sales;
  return {salesData, loading, getCustomerData};
};

const computeCustomerRemaingAmount = () =>{
   const {customerData, loading, getCustomerData} = useCustomer();
    let salesData = []
    customerData.forEach(item=>{
      salesData.push(...item.sales)
    });

     let total = 0;
    salesData.forEach(item => {
      total += parseInt(item.grandtotal, 10) - parseInt(item.customer_payment, 10);
    });

    return total;

}

export {CustomerDataProvider, useCustomer, getCustomerSales, computeCustomerRemaingAmount};
