<script lang="ts" setup>
import { computed } from 'vue';
import useUserStore from '~/stores/user';
import router from '~/router';

const userStore = useUserStore();
const username = computed(() => {
  return userStore.username || '';
});

function logout() {
  userStore.logout();
  router.push('/');
}
</script>

<template>
  <div class="user-profile">
    <img
      class="user-icon"
      src="../../assets/images/male-avatar.gif"
      alt="user icon"
      v-if="username"
    />
    <div class="skeleton skeleton-avatar" v-else></div>
    <span class="user-name" v-if="username"> {{ username }} </span>
    <div class="skeleton skeleton-line" v-else></div>
    <button class="btn-logout" @click="logout">
      <svg
        width="24"
        height="32"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M174.011 86L216 128L174.011 170"
          stroke="white"
          stroke-width="24"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M104 128H215.971"
          stroke="white"
          stroke-width="24"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M104 216H48C45.8783 216 43.8434 215.157 42.3431 213.657C40.8429 212.157 40 210.122 40 208V48C40 45.8783 40.8429 43.8434 42.3431 42.3431C43.8434 40.8429 45.8783 40 48 40H104"
          stroke="white"
          stroke-width="24"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-icon {
  height: 30px;
  border-radius: 50%;
}

.user-name {
  font-size: rem(16);
  font-weight: 600;
  color: $text-white;
  line-height: 1;
  min-width: 140px;
}

.skeleton-line {
  min-width: 140px;
  min-height: 18px;
}
</style>
