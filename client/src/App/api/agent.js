import axios  from 'axios';
import { toast } from 'react-toastify';
axios.defaults.baseURL = 'https://localhost:5002/api/';

const responseBody = (response) => response.data;
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { data, status } = error.response;
    console.log(data); // Log the data object to inspect its properties
    switch (status) {
      case 400:
        toast.error(data.message);
        break;
      case 401:
        toast.error(data.message);
        break;
      case 404:
        toast.error(data.message);
        break;
      case 500:
        toast.error("server error");
        break;
      default:
        toast.error(data.message);
        break;
    }
    return Promise.reject(error);
  }
);

const requests = {
    get: (url) => axios.get(url).then(responseBody),
    post: (url, body) => axios.post(url, body).then(responseBody),
    put: (url, body) => axios.put(url, body).then(responseBody),
    del: (url) => axios.delete(url).then(responseBody)
}

const catalog = {
    list: () => requests.get('/Product'),
    details: (id) => requests.get(`/Product/${id}`)
}


const TestErrors = {
    get404Error: () => requests.get('/buggy/not-found'),
    get400Error: () => requests.get('/buggy/bad-request'),
    get500Error: () => requests.get('/buggy/servererror'),
    get401Error: () => requests.get('/buggy/auth'),
    get400ValidationError: () => requests.post('/buggy/validation-error')
}
const agent = {
    catalog,
    TestErrors
}
export default agent;