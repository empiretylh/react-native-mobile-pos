import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'mobilepos.db',
    location: 'default',
  },
  () => {},
  error => {  
    console.log('ERROR: ' + error);
  },
);

const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, title TEXT NOT NULL, user_id INTEGER NOT NULL)',
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS products (id INTEGER, name TEXT NOT NULL, price TEXT NOT NULL, cost TEXT NOT NULL DEFAULT 0, qty TEXT NOT NULL, date TEXT NOT NULL, description TEXT, category_id INTEGER NOT NULL, pic TEXT, user_id INTEGER NOT NULL, barcode TEXT)',
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS sales (id INTEGER, receipt_number INTEGER PRIMARY KEY AUTOINCREMENT, voucher_number TEXT NOT NULL DEFAULT 0, customer_name TEXT NOT NULL, total_amount TEXT NOT NULL, total_profit TEXT NOT NULL DEFAULT 0, tax TEXT NOT NULL, discount TEXT NOT NULL, grandtotal TEXT NOT NULL, delivery_charges TEXT, user_id INTEGER NOT NULL, date TEXT NOT NULL, description TEXT)',
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS sold_products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price TEXT NOT NULL, profit TEXT NOT NULL DEFAULT 0, qty TEXT NOT NULL, date TEXT NOT NULL, sales_id INTEGER NOT NULL, user_id INTEGER NOT NULL, product_id TEXT NOT NULL, cost TEXT DEFAULT 0)',
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, price TEXT NOT NULL, date TEXT, description TEXT, user_id INTEGER NOT NULL)',
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, profileimage TEXT, name TEXT NOT NULL, address TEXT NOT NULL, email TEXT NOT NULL, phoneno TEXT NOT NULL)',
    );
  });
};

// Clear data from all table
const clearLocalData = () => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM categories', []);
    tx.executeSql('DELETE FROM products', []);
    tx.executeSql('DELETE FROM sales', []);
    tx.executeSql('DELETE FROM sold_products', []);
    tx.executeSql('DELETE FROM expenses', []);
  });
};

export {db, createTables, clearLocalData};
