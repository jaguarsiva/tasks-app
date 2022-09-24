<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '~/stores/user';
import type User from '~/utils/types/User.type';

interface Props {
  user: User;
}
const { user } = defineProps<Props>();

const router = useRouter();
const userStore = useUserStore();

function loginUser() {
  userStore.login(user);
  router.push('/boards');
}
</script>

<template>
  <button class="user-box" @click="loginUser">
    <img
      v-if="user.gender === 'MALE'"
      src="../../assets/images/male-avatar.gif"
      class="user-icon"
      alt="user-icon"
    />
    <img
      v-else
      src="../../assets/images/female-avatar.gif"
      class="user-icon"
      alt="user-icon"
    />
    <span class="user-name">{{ user.fullname }}</span>
  </button>
</template>

<style lang="scss" scoped>
.user-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.user-icon {
  height: 100px;
  border-radius: 50%;
}

.user-name {
  font-size: rem(18);
  font-weight: 300;
  font-style: italic;
  color: $muted-white;
  margin-top: 8px;
}
</style>
