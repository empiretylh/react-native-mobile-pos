import axios from 'axios';
import {db} from './LocalDb';

// Insert Expense into expenses table
export const insertExpense = (title, price, date, description, user_id) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO expenses (title, price, date, description, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, price, date, description, user_id],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Expense Inserted');
        } else {
          console.log('Insert Failed');
        }
      },
    );
  });
};

// Get All Expenses from expenses table
export const getAllExpenses = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM expenses', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        resolve(temp);
      });
    });
  });
};

export const DeleteExpenses = id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM expenses WHERE id=?', [id], (tx, results) => {
        resolve(results);
      });
    });
  });
};

const uploadExpensesToServer = async () => {
  const expenses = await getAllExpenses();
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      // const {title, price, date, description, user_id} = expense;

      const response = await axios.post('/api/expenses/', expense);

      await DeleteExpenses(expense.id);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    resolve(1);
  });
};

export {uploadExpensesToServer};
