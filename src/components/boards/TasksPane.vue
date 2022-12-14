<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import moment from 'moment';
import TasksGroups from '~/components/boards/TasksGroup.vue';
import api from '~/utils/api';
import useUserStore from '~/stores/user';
import lodash, { remove } from 'lodash';
import type Task from '~/utils/types/Task.type';
import { TaskStatus } from '~/utils/types/Task.type';

interface Props {
  date: Date;
}
const props = defineProps<Props>();
const debouncedFetchTasks = useDebounceFn(fetchTasks, 500);

const isLoading = ref<Boolean>(true);
const userStore = useUserStore();
const tasks = ref<Task[]>([]);

interface GroupsType {
  title: string;
  tasks: Task[];
}

const initalValue = computed<GroupsType[]>(() => {
  const dateChosen = moment(props.date).format('DD/MM/YYYY');
  const todayDate = moment().format('DD/MM/YYYY');

  const isToday = dateChosen === todayDate;
  const isFutureDate = moment(props.date).isAfter(moment());

  let results = [];

  const active = { title: 'active', tasks: [] };
  const completed = { title: 'completed', tasks: [] };
  const pushed = { title: 'pushed', tasks: [] };
  const removed = { title: 'removed', tasks: [] };

  if (isToday) results.push(active, completed, pushed);
  else if (isFutureDate) results.push(active);
  else results.push(completed, pushed, removed);

  return results;
});

const taskGroups = computed(() => {
  return tasks.value.reduce((result, task) => {
    const group = result.find(g => g.title === task.status.toLowerCase());
    if (group) group.tasks.push(task);
    return result;
  }, lodash.cloneDeep(initalValue.value));
});

async function fetchTasks(value: Date) {
  try {
    const date = moment(value).format('DD/MM/YYYY');
    isLoading.value = true;
    tasks.value = [];
    const response = await api.get(`tasks?date=${date}`);
    tasks.value = response.data.tasks;
  } catch (error: any) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

interface UpdatePayloadType {
  id: string;
  status: TaskStatus;
}

function update({ id, status: newStatus }: UpdatePayloadType) {
  const task = tasks.value.find(t => t.id === id)!;
  const oldStatus = task.status;

  if (oldStatus === TaskStatus.ACTIVE) {
    if (newStatus === TaskStatus.PUSHED) pushTask(id);
    else updateTask(id, { status: newStatus });
  } else if (
    oldStatus === TaskStatus.PUSHED &&
    newStatus === TaskStatus.ACTIVE
  ) {
    bringBackTask(id);
  } else if (
    oldStatus === TaskStatus.COMPLETED &&
    newStatus === TaskStatus.ACTIVE
  ) {
    updateTask(id, { status: newStatus });
  } else {
    return; // update operation not allowed
  }
  task.status = newStatus;
}

function addTask(task: Task) {
  tasks.value.push(task);
}

function saveTask(task: Task) {
  const foundTask = tasks.value.find(t => t.id === task.id);
  if (!foundTask) return;

  foundTask.title = task.title;
  foundTask.description = task.description;
}

interface UpdateType {
  title?: string;
  description?: string;
  status?: string;
}

async function updateTask(id: string, fieldsToUpdate: UpdateType) {
  try {
    await api.patch(`tasks/${id}`, fieldsToUpdate);
  } catch (error) {
    console.log(error);
  }
}

async function pushTask(id: string) {
  try {
    await api.patch(`tasks/${id}/push`);
  } catch (error) {
    console.log(error);
  }
}

async function bringBackTask(id: string) {
  try {
    await api.delete(`tasks/${id}/push`);
  } catch (error) {
    console.log(error);
  }
}

watch(
  () => props.date,
  value => {
    isLoading.value = true;
    tasks.value = [];
    debouncedFetchTasks(value);
  }
);

watch(
  () => userStore.isLoggedIn,
  () => {
    if (userStore.isLoggedIn) fetchTasks(props.date);
  },
  { immediate: true }
);
</script>

<template>
  <section class="task-pane">
    <TasksGroups
      v-for="group in taskGroups"
      :key="group.title"
      :heading="group.title"
      :is-loading="isLoading"
      :tasks="group.tasks"
      :date="props.date"
      @update="update"
      @add="addTask"
      @save="saveTask"
    />
  </section>
</template>

<style lang="scss" scoped>
.task-pane {
  display: flex;
  gap: 24px;
  padding: 0 60px;
  flex-shrink: 0;
  flex-grow: 0;
  height: calc(100vh - 200px);
}
</style>
