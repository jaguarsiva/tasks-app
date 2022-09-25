import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type User from '~/utils/types/User.type';
import api from '~/utils/api';
import router from '~/router';

const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const isLoading = ref<Boolean>(false);
  const isUsersFetched = ref<Boolean>(false);
  const user = ref<User | null>(null);

  const firstName = computed(() =>
    user.value ? user.value.fullname.split(' ')[0] : ''
  );
  const username = computed(() => (user.value ? user.value.username : ''));
  const isLoggedIn = computed(() => Boolean(user.value));

  function login(loggingUser: User) {
    user.value = loggingUser;
    localStorage.setItem('userId', loggingUser.id);
    router.push('/boards');
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('userId');
    router.push('/');
  }

  async function fetchUsers() {
    try {
      isLoading.value = true;
      const response = await api.get('users');
      users.value = response.data.users;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
      isUsersFetched.value = true;
    }
  }

  return {
    firstName,
    username,
    isLoggedIn,
    user,
    users,
    isLoading,
    isUsersFetched,
    login,
    logout,
    fetchUsers
  };
});

export default useUserStore;
