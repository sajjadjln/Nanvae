import axios from 'axios';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../models/pagination';
import { store } from '../store/configureStore';


axios.defaults.baseURL = 'http://localhost:5002/api/';
axios.defaults.withCredentials = true;
const responseBody = (response) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
});
axios.interceptors.response.use(
  (response) => {
    return new Promise((resolve) => setTimeout(() => resolve(response), 500))
      .then((response) => {
        const pagination = response.headers['pagination'];
        if (pagination) {
          response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
          console.log(response);
        }
        return response;
      });
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
const account = {

  login: (values) => requests.post('/account/login', values),
  register: (values) => requests.post('/account/register', values),
  current: () => requests.get('/account/currentUser'),
  fetchAddresses: () => requests.get('/account/savedAddress'),

}
const orders = {
  list: () => requests.get('orders'),
  fetch: (id) => requests.get(`orders/${id}`),
  create:(values) => requests.post(`orders`,values)
}
const agent = {
  catalog,
  TestErrors,
  basket,
  account,
  orders
};

export default agent;
