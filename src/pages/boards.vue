<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '~/utils/api';
import useUserStore from '~/stores/user';
import UserProfile from '~/components/boards/UserProfile.vue';
import DatePane from '~/components/boards/DatePane.vue';
import TasksPane from '~/components/boards/TasksPane.vue';

const isLoading = ref<Boolean>(true);
const userStore = useUserStore();

const dateChosen = ref<Date>(new Date());
function updateDate(updatedDate: Date) {
  dateChosen.value = updatedDate;
}

onMounted(async () => {
  if (userStore.isLoggedIn) return;
  try {
    isLoading.value = true;
    const userId = localStorage.getItem('userId');
    const response = await api.get(`users/${userId}`);
    const user = response.data.user;
    userStore.login(user);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="page">
    <header>
      <h1>Tasks App</h1>
      <UserProfile />
    </header>
    <DatePane :dateChosen="dateChosen" @update="updateDate" />
    <TasksPane :date="dateChosen" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  height: 70px;
  border-bottom: 2px solid $border-grey;

  h1 {
    font-size: rem(26);
    font-weight: 500;
    color: $text-white;
    line-height: 1;
  }
}
</style>
