import {db} from './LocalDb';

// Insert Categories into categories table
export const insertCategories = (id, title, user_id = 1) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO categories (id, title, user_id) VALUES (?,?,?)',
      [id, title, user_id],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Categories Inserted');
        } else {
          console.log('Insert Failed');
        }
      },
    );
  });
};
// Insert Product into products table
export const insertProduct = async (
  id,
  name,
  price,
  cost,
  qty,
  date,
  description = '',
  category_id,
  pic = '',
  user_id = 1,
) => {
  db.transaction(txn => {
    txn.executeSql(
      'INSERT INTO products (id, name, price, cost, qty, date, description, category_id, pic, user_id) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        id,
        name,
        price,
        cost,
        qty,
        date,
        description,
        category_id,
        pic,
        user_id,
      ],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Product Inserted');
        } else {
          console.log('Insert Failed');
        }
      },
      error => {
        console.log(error);
      },
    );
  });

  //Get All products
};

// Get All products from products table
export const getAllProducts = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM products',
        [],
        (tx, results) => {
          console.log('Results', results.rows.length);
          if (results.rows.length > 0) {
            let products = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);

              products.push(row);
            }

            resolve(products);
          } else {
            resolve(null);
          }
        },
        error => {
          console.log(error);
          reject(error);
        },
      );
    });
  });
};

// Get all categores from categories table
export const getAllCategories = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM categories',
        [],
        (tx, results) => {
          console.log('Results', results.rows.length);
          if (results.rows.length > 0) {
            let categories = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              categories.push(row);
            }
            resolve(categories);
          } else {
            resolve(null);
          }
        },
        error => {
          console.log(error);
          reject(error);
        },
      );
    });
  });
};

// Delete all data from table when the cloud server pull the data
export const deleteCategories = () => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM categories', [], (tx, results) => {
      console.log('Results', results.rowsAffected);
      if (results.rowsAffected > 0) {
        console.log('Categories Deleted');
      } else {
        console.log('Delete Failed');
      }
    });
  });
};

export const deleteProducts = () => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM products', [], (tx, results) => {
      console.log('Results', results.rowsAffected);
      if (results.rowsAffected > 0) {
        console.log('Products Deleted');
      } else {
        console.log('Delete Failed');
      }
    });
  });
};

// Get products by id
export const getProductById = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM products where id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
          }
        },
      );
    });
  });
};

// update products qty by id
export const updateProductQty = (id, qty) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE products set qty=? where id=?',
      [qty, id],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Product Updated');
        } else {
          console.log('Update Failed');
        }
      },
    );
  });
};

// get all products

export const getAllProductss = () => {
  console.log('Get all Products');
  insertProduct(
    122,
    'asd',
    100,
    50,
    1,
    new Date().toString(),
    'what',
    12,
    'pic',
    1,
  );
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM products', [], (tx, results) => {
      console.log('Results', results.rowsAffected);
      if (results.rowsAffected > 0) {
        console.log(results.rows);
        return results.rows;
      } else {
        console.log('No Products');
        return null;
      }
    });
  });
};
