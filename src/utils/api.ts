import axios from 'axios';
import useUserStore from '~/stores/user';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER
});

api.interceptors.request.use(config => {
  const userStore = useUserStore();
  if (userStore.user) {
    config.headers!.user_id = userStore.user.id;
  }
  return config;
});

export default api;
