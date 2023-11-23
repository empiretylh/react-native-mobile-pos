import React from 'react';
import axios from 'axios';

const SupplierContext = React.createContext();

const SupplierDataProvider = ({children}) => {
  const [supplierData, setSupplierData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getSupplierData = () => {
    setLoading(true);
    axios
      .get('/api/supplier/')
      .then(res => {
        setSupplierData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getSupplierData();
  }, []);

  return (
    <SupplierContext.Provider value={{supplierData, loading, getSupplierData}}>
      {children}
    </SupplierContext.Provider>
  );
};

const useSupplier = () => React.useContext(SupplierContext);
const getSupplierProducts = (id)=>{
  const {supplierData, loading, getSupplierData} = useSupplier()

  if(id == 'all'){
    let productsData = []
    supplierData.forEach(item=>{
      productsData.push(...item.products)

    })

    return {productsData, loading, getSupplierData}
  }

   let  productsData = supplierData.filter(item=> item.id == id)[0].products;
   return {productsData, loading, getSupplierData}

}


const computeSupplierRemainingAmount = (id)=>{
  const {supplierData, loading, getSupplierData} = useSupplier()

    let productsData = []
    supplierData.forEach(item=>{
      productsData.push(...item.products)

    })

    let total = 0;

     productsData.forEach(item => {
      let remaing = parseInt(item.cost) * parseInt(item.qty)

      total +=  remaing - parseInt(item.supplier_payment)
    });

     return total;


}


export {SupplierDataProvider, useSupplier, getSupplierProducts, computeSupplierRemainingAmount};
