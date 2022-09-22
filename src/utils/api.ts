import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://tasks-apiserver.herokuapp.com/api/v1'
});

let myInterceptor: number;
export function setHeader(userId: string) {
  myInterceptor = axiosInstance.interceptors.request.use(
    function (config) {
      config.headers!.user_id = userId;
      return config;
    },
    function (error) {
      console.log(error);
      return Promise.reject(error);
    }
  );
}

export function removeHeader() {
  axiosInstance.interceptors.request.eject(myInterceptor);
}

export default axiosInstance;
