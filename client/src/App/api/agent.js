import axios from 'axios';
import { toast } from 'react-toastify';



axios.defaults.baseURL = 'http://localhost:5002/api/';
axios.defaults.withCredentials = true;
const responseBody = (response) => response.data;

axios.interceptors.response.use(
  (response) => {
    return new Promise((resolve) => setTimeout(() => resolve(response), 500));
  },
  (error) => {
    const { data, status } = error.response;
    switch (status) {
      case 400:
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.message);
        break;
      case 404:
        toast.error(data.message);
        break;
      case 500:
        window.location.href = '/server-error'; // Redirect to server error page
        break;
      default:
        toast.error(data.message);
        break;
    }
    return Promise.reject(error);
  }
);


const requests = {
  get: (url,params) => axios.get(url,{params}).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  del: (url) => axios.delete(url).then(responseBody),
};

const catalog = {
  list: (params) => requests.get('/Product',params),
  details: (id) => requests.get(`/Product/${id}`),
  fetchFilter: () => requests.get('/Product/filters'),
};

const TestErrors = {
  get404Error: () => requests.get('/buggy/notfound'),
  get400Error: () => requests.get('/buggy/badrequest'),
  get500Error: () => requests.get('/buggy/servererror'),
  get401Error: () => requests.get('/buggy/auth'),
  getValidationError: () => requests.post('/buggy/validation-error'),
};
const basket =
{
    get: () => requests.get('basket'),
    addItem: (productId, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem: (productId, quantity = 1) => requests.del(`basket?productId=${productId}&quantity=${quantity}`),
    // del or delete
}
const agent = {
  catalog,
  TestErrors,
  basket
};

export default agent;
