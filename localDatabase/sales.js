import axios from 'axios';
import {db} from './LocalDb';
export const insertSale = async (
  customerName,
  totalAmount,
  totalProfit,
  tax,
  discount,
  grandTotal,
  deliveryCharges,

  date,
  description,
  isDiscountAmount = 0,
) => {
  // return promise saleid after insert
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let d = new Date().getTime();
      tx.executeSql(
        'INSERT INTO sales (voucher_number, customer_name, total_amount, total_profit, tax, discount, grandtotal, delivery_charges, user_id, date, description, isDiscountAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          d,
          customerName,
          totalAmount,
          totalProfit,
          tax,
          discount,
          grandTotal,
          deliveryCharges,
          1,
          date,
          description,
          isDiscountAmount,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Sale Inserted');
            resolve(d); // return sale id
          } else {
            console.log('Insert Failed');
            reject();
          }
        },
      );
    });
  });
};
export const insertSoldProduct = (
  name,
  price,
  qty,
  date,
  sales_id,
  user_id,
  product_id,
  cost,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO sold_products (name, price, qty, date, sales_id, user_id, product_id, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, qty, date, sales_id, user_id, product_id, cost],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Sold Product Inserted');
        } else {
          console.log('Insert Failed');
        }
      },
    );
  });
};

export const getAllSales = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT sales.*, sold_products.name AS product_name, sold_products.price, sold_products.profit, sold_products.qty, sold_products.product_id, sold_products.cost FROM sales LEFT JOIN sold_products ON sales.voucher_number = sold_products.sales_id',
        //  'SELECT * FROM sales',
        [],
        (tx, results) => {
          const sales = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const sale = sales.find(s => s.id === row.voucher_number);
            //        console.log('row id : ', row.id);

            // console.log('sales', sale);
            //  sales.push('id : ' + row.voucher_number);
            if (sale) {
              // Add sold product to existing sale
              sale.products.push({
                name: row.product_id,
                pdname: row.product_name,
                price: row.price,
                qty: row.qty,
                cost: row.cost,
              });
            } else {
              // Create new sale with sold product
              sales.push({
                id: row.voucher_number,
                date: row.date,
                customerName: row.customer_name,
                totalAmount: row.total_amount,
                tax: row.tax,
                discount: row.discount,
                grandtotal: row.grandtotal,
                deliveryCharges: row.delivery_charges,
                description: row.description,
                isDiscountAmount: row.isDiscountAmount,
                products: [
                  {
                    name: row.product_id,
                    pdname: row.product_name,
                    price: row.price,
                    qty: row.qty,
                    cost: row.cost,
                  },
                ],
              });
            }
          }
          resolve(sales);
        },
        error => {
          reject(error);
        },
      );
    });
  });
};

//Delete sales also delete sold products
export const DeleteSales = id => {
  console.log('DELETE Sales', id);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM sales WHERE voucher_number=?',
        [id],
        (tx, results) => {
          resolve(results);
        },
      );
    });
  });
};

//Send server to sales
export const uploadSalesToServer = async () => {
  const sales = await getAllSales();

  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < sales.length; i++) {
      const sale = sales[i];
      // const {title, price, date, description, user_id} = expense;
      const data = {...sale, products: JSON.stringify(sale.products)};

      const response = await axios.post('/api/sales/  ', data);

      //    if (response.status === 200) {
      await DeleteSales(sale.id);
      //    }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    resolve(1);
  });
};

export const CreateReceiptLocal = (
  c,
  p,
  totalAmount,
  grandtotal,
  tax,
  discount,
  delivery,
  description,
  isDiscountAmount

) => {
  return new Promise((resolve, reject) => {
    console.log(
      c,
      p,
      totalAmount,
      grandtotal,
      tax,
      discount,
      delivery,
      description,
      isDiscountAmount
    );
    let date = new Date().toISOString().slice(0, 10);
    insertSale(
      c, //is customername
      totalAmount,
      totalAmount, //is total profit
      tax,
      discount,
      grandtotal,
      delivery,
      date,
      description,
      isDiscountAmount
    )
      .then(saleId => {
        // Insert sold products into sold_products table

        console.log('Sales Id :', saleId);
        p.forEach(product => {
          insertSoldProduct(
            product.pdname,
            product.price,
            product.qty,
            new Date().toISOString().slice(0, 10),
            saleId,
            1,
            product.name, //is product id
            product.cost ? product.cost : 0,
          );
        });

        resolve(saleId); // return sale id
      })
      .catch(error => {
        console.log('Insert failed', error);
      });
  });
};
