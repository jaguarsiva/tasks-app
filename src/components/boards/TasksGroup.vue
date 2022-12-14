<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import type Task from '~/utils/types/Task.type';
import { TaskStatus } from '~/utils/types/Task.type';
import TaskItem from '~/components/boards/TaskItem.vue';
import AddTask from '~/components/boards/AddTask.vue';
import moment from 'moment';

interface Props {
  heading: string;
  tasks: Task[];
  isLoading: Boolean;
  date: Date;
}
const emit = defineEmits(['add', 'update', 'save']);
const props = withDefaults(defineProps<Props>(), {
  heading: '',
  tasks: () => [],
  isLoading: () => false,
  date: () => new Date()
});

const badgeClassName = computed(() => props.heading.toLowerCase() + '-badge');

const isAddButtonVisible = computed(() => {
  const dateChosen = moment(props.date).format('DD/MM/YYYY');
  const todayDate = moment().format('DD/MM/YYYY');

  const isToday = dateChosen === todayDate;
  return (
    props.heading === 'active' &&
    !isAddFormVisible.value &&
    !props.isLoading &&
    isToday
  );
});

const isAddFormVisible = ref(false);
const isDropZone = ref(false);
const taskGroupEl = ref<HTMLDivElement | null>(null);

function showAddTask() {
  isAddFormVisible.value = true;
  scrollGroup();
}

async function scrollGroup() {
  const element = taskGroupEl.value as HTMLDivElement;
  await nextTick();
  element.scroll({
    behavior: 'smooth',
    top: element.scrollHeight
  });
}

interface UpdatePayloadType {
  id: string;
  status: TaskStatus;
}

function updateTask(payload: UpdatePayloadType) {
  emit('update', payload);
}

function addTask(task: Task) {
  isAddFormVisible.value = false;
  emit('add', task);
  scrollGroup();
}

function saveTask(task: Task) {
  emit('save', task);
}

function onDrop(event: any) {
  const id = event.dataTransfer.getData('id');
  const status = props.heading.toUpperCase() as TaskStatus;
  updateTask({ id, status });
}

function dragEnter() {
  console.log('dragEnter called');
  isDropZone.value = true;
}

function dragLeave() {
  console.log('dragLeave called');
  isDropZone.value = false;
}
</script>

<template>
  <div
    class="tasks-group"
    :class="{ 'is-dragging': isDropZone }"
    ref="taskGroupEl"
    @dragenter.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="row">
      <h3 class="group-heading">
        {{ props.heading }}
      </h3>
      <div class="row-controls">
        <button
          class="btn add-btn"
          v-if="isAddButtonVisible"
          @click="showAddTask"
        >
          Add
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM11 8a1 1 0 1 1 2 0v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H8a1 1 0 1 1 0-2h3V8Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span class="count-badge" :class="badgeClassName">
          {{ tasks.length }}
        </span>
      </div>
    </div>
    <ul class="tasks-list" v-if="tasks.length">
      <li v-for="task in props.tasks" :key="task.id">
        <TaskItem :task="task" @update="updateTask" @save="saveTask" />
      </li>
    </ul>

    <div
      v-if="props.heading === 'active' && isAddFormVisible"
      class="add-wrapper"
    >
      <AddTask
        @add="addTask"
        @save="saveTask"
        @cancel="isAddFormVisible = false"
      />
    </div>

    <template v-if="!tasks.length && !isAddFormVisible">
      <div v-if="isLoading" class="loader-wrapper">
        <div
          class="skeleton skeleton-card"
          v-for="i in Math.floor(Math.random() * 3) + 1"
          :key="i"
        >
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
        </div>
      </div>
      <span class="placeholder-text" v-else> No task... </span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.tasks-group {
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  border: 1px solid #2c3333;
  padding-bottom: 24px;

  &.is-dragging {
    border: 2px dashed $primary-green !important;
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px 16px;
  margin-bottom: 4px;
  height: 80px;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  background-color: #000;
}

.group-heading {
  font-size: rem(20);
  font-weight: 600;
  line-height: 1;
  padding: 8px;
  text-transform: capitalize;
}

.row-controls {
  display: flex;
  align-items: center;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: rem(14);
  background-color: $primary-blue;
  color: $muted-blue;
  border-radius: 8px;
  margin-left: auto;
  padding: 4px 8px;
  height: 32px;
  margin-right: 12px;

  svg {
    transform: scale3d(0.8, 0.8, 0.8);
  }

  path {
    fill: $muted-blue;
  }
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 28px;

  li {
    flex-grow: 0;
    flex-shrink: 0;
  }
}

.count-badge {
  display: inline-block;
  padding: 8px 12px 6px;
  font-size: rem(18);
  font-weight: 500;
  line-height: 1;
  border-radius: 8px;

  &.active-badge {
    background-color: $muted-blue;
    color: $primary-blue;
  }
  &.completed-badge {
    background-color: $muted-green;
    color: $primary-green;
  }

  &.pushed-badge,
  &.removed-badge {
    background-color: $muted-red;
    color: $primary-red;
  }
}

.placeholder-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: rem(20);
  font-weight: 400;
  color: $muted-white;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
}

.skeleton-card {
  background-color: hsl(215, 21%, 14%);
  padding: 12px 20px 16px;
  margin-bottom: 16px;
  border-radius: 8px;

  .skeleton-line {
    margin-bottom: 8px;
    border-radius: 12px;
  }
}

.add-wrapper,
.loader-wrapper {
  padding: 0 28px 0;
}

.add-wrapper {
  margin-top: 16px;
}
</style>
