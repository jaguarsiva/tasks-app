import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER
});

let myInterceptor: number;
export function setHeader(userId: string) {
  myInterceptor = axiosInstance.interceptors.request.use(
    function (config) {
      config.headers!.user_id = userId;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
}

export function removeHeader() {
  axios.interceptors.request.eject(myInterceptor);
}

export default axiosInstance;
