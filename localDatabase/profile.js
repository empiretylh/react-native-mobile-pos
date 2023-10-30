import {db} from './LocalDb';

const getAllProfile = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM profile', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        resolve(temp[0]);
      });
    });
  });
};

const insertProfile = profile => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO profile (profileimage, name, address, email, phoneno) VALUES (?, ?, ?, ?, ?)',
      [
        profile.profileimage,
        profile.name,
        profile.address,
        profile.email,
        profile.phoneno,
      ],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('Profile Inserted');
        } else {
          console.log('Insert Failed');
        }
      },
    );
  });
};

const DeleteAllProfile = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM profile', [], (tx, results) => {
        resolve(results);
      });
    });
  });
};

export {getAllProfile, insertProfile, DeleteAllProfile};
