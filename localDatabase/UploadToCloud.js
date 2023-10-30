import {uploadExpensesToServer} from './expense';
import {uploadSalesToServer} from './sales';

export const UploadToCloud = async () => {
  let i = await uploadSalesToServer();
  let j = await uploadExpensesToServer();
  return new Promise((resolve, reject) => {
    if (i && j) resolve(1);
  });
};
