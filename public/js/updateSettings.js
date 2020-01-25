/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

//type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    // const res = await axios.post(
    //   'http://localhost:8000/api/v1/users/updateMe',
    //   {
    //     name,
    //     email
    //   }
    // );const
    if ((res.data.status = 'success'))
      showAlert('success', `${type.toUpperCase()} Updated Successfully`);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
