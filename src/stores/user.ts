import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { setHeader, removeHeader } from '~/utils/api';
import type User from '~/utils/types/User.type';

const useUserStore = defineStore('user', () => {
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

  return { firstName, username, isLoggedIn, login, logout };
});

export default useUserStore;
