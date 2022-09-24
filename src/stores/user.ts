import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { setHeader, removeHeader } from '~/utils/api';
import type User from '~/utils/types/User.type';
import api from '~/utils/api';

const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const isLoading = ref<Boolean>(false);
  const isUsersFetched = ref<Boolean>(false);
  const user = ref<User | null>(null);

  const firstName = computed(() => {
    if (user.value) return user.value.fullname.split(' ')[0];
    else return null;
  });

  const username = computed(() => {
    if (user.value) return user.value.username;
    else return null;
  });

  const isLoggedIn = computed(() => {
    return !!user.value;
  });

  function login(loggingUser: User) {
    user.value = loggingUser;
    localStorage.setItem('userId', user.value.id);
    setHeader(user.value.id);
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('userId');
    removeHeader();
  }

  async function fetchUsers() {
    try {
      isLoading.value = true;
      const response = await api.get('users');
      users.value = response.data.users;
      isUsersFetched.value = true;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    firstName,
    username,
    isLoggedIn,
    user,
    login,
    logout,
    fetchUsers,
    users,
    isLoading,
    isUsersFetched
  };
});

export default useUserStore;
