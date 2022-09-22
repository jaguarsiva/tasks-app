<script lang="ts" setup>
import { ref, computed } from 'vue';
import TaskItem from '~/components/boards/TaskItem.vue';
import AddTask from '~/components/boards/AddTask.vue';
import type Task from '~/utils/types/Task.type';

interface Props {
  heading: string;
  tasks: Task[];
  isLoading: Boolean;
}
const emit = defineEmits(['add', 'update', 'save']);

const props = withDefaults(defineProps<Props>(), {
  heading: '',
  tasks: () => [],
  isLoading: () => false
});

const badgeClassName = computed(() => {
  return props.heading.toLowerCase() + '-badge';
});

const isAddFormVisible = ref(false);

interface UpdatePayloadType {
  id: string;
  type: 'complete' | 'push' | 'remove';
}

function updateTask(payload: UpdatePayloadType) {
  emit('update', payload);
}

function addTask(task: Task) {
  isAddFormVisible.value = false;
  emit('add', task);
}

function saveTask(task: Task) {
  console.log('saveTask', task);

  emit('save', task);
}
</script>

<template>
  <div class="tasks-group">
    <div class="row">
      <h3 class="group-heading">
        {{ props.heading }}
      </h3>
      <div>
        <button
          class="btn add-btn"
          v-if="props.heading === 'active' && !isAddFormVisible"
          @click="isAddFormVisible = true"
        >
          Add task
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

    <AddTask
      v-if="props.heading === 'active' && isAddFormVisible"
      @add="addTask"
      @save="saveTask"
      @cancel="isAddFormVisible = false"
    />

    <span class="placeholder-text" v-if="!tasks.length && !isAddFormVisible">
      {{ isLoading ? 'Loading...' : 'No task...' }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.tasks-group {
  width: 100%;
  height: 100%;
  background-color: #161b22;
  border-radius: 12px;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  height: 80px;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  background-color: #161b22;
}

.group-heading {
  font-size: rem(20);
  font-weight: 600;
  line-height: 1;
  padding: 8px;
  text-transform: capitalize;
}

.add-btn {
  font-size: rem(14);
  font-weight: 500;
  background-color: $primary-blue;
  color: $muted-blue;
  border-radius: 8px;
  margin-left: auto;
  padding: 4px 12px;
  margin-right: 12px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;

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
</style>
