import axios from 'axios';
const instance = axios.create();

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
        'http://localhost:8000/api/create',
        {},
        {
        headers:{
          authtoken,
        },
      });
};


export const currentUser = async (authtoken) => {
  return await axios.post(
        'http://localhost:8000/api/current-user',
        {authtoken}
      );
};


// export const currentAdmin = async (authtoken) => {
//   return await instance.post(
//         'http://localhost:8000/api/current-admin',
//         {authtoken}
//       );
// };
