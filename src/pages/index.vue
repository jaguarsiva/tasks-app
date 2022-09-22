<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserBox from '~/components/home/UserBox.vue';
import api from '~/utils/api';
import type User from '~/utils/types/User.type';

const users = ref<User[]>([]);
const isLoading = ref<Boolean>(true);

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await api.get('users');
    users.value = response.data.users;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="page">
    <section class="page-content">
      <h1>Welcome Back! 😎</h1>
      <p>Please choose your account</p>
      <span class="loading-text" v-if="isLoading">Loading...</span>
      <ul v-else class="users-list">
        <li v-for="user in users" :key="user.id">
          <UserBox :user="user" />
        </li>
      </ul>
    </section>
    <section class="page-image">
      <img src="../assets/images/macaw.jpeg" alt="macaw" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.page-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 50%;

  h1 {
    font-size: rem(36);
    font-weight: 500;
    line-height: 1.6;
  }

  p {
    font-size: rem(20);
    color: $muted-white;
    line-height: 1.6;
    margin: 8px 0 28px;
  }

  .users-list {
    display: flex;
    gap: 28px;
  }

  .loading-text {
    font-size: rem(20);
    color: $muted-white;
    line-height: 131px;
  }
}

.page-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;

  img {
    height: 100%;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 0 8px rgba($color: $text-white, $alpha: 0.15);
  }
}
</style>
