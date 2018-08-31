import axios from 'axios';
import { store } from '../store/store';
import { logOut } from '../actions/login'
import { resetStateDashFilter } from '../actions/dashFilter'
import { closeAppQlik } from '../actions/qlik'

//const BACKEND_URL = process.env.NODE_ENV === 'production' ? "http://name.herokuapp.com" : "http://localhost:8000/"
//const BACKEND_URL = "http://localhost:10547/api/SellerPoint/"
const BACKEND_URL = "https://qa.kinimetrix.com/api/SellerPoint/";
//const BACKEND_URL = window.location.origin + '/api/SellerPoint/';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    // 'authToken': store.getState().login.authToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Add a response interceptor
api.interceptors.response.use(null, function (error) {
  // Logout on 403 response error
  if (error.response.status === 403) {
    // log out user if already logged in else send user to login screen
    store.dispatch(logOut())
    store.dispatch(closeAppQlik())
    store.dispatch(resetStateDashFilter())
  }
  return Promise.reject(error);
});

export default api;
export { BACKEND_URL };

