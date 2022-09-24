<script lang="ts" setup>
import { computed, ref } from 'vue';
import type Task from '~/utils/types/Task.type';
import AddTask from '~/components/boards/AddTask.vue';
import moment from 'moment';

interface Props {
  task: Task;
}
const props = defineProps<Props>();
const emit = defineEmits(['update', 'edit', 'save']);

const task = computed(() => {
  return props.task;
});

const isTodayTask = computed(() => {
  const today = moment().format('DD/MM/YYYY');
  return task.value.date === today;
});

const isEditEnabled = ref(false);

function update(type: string) {
  isEditEnabled.value = true;
  emit('update', {
    id: task.value.id,
    type
  });
}

function save(task: Task) {
  isEditEnabled.value = false;
  emit('save', task);
}

function onDragStart(event: any) {
  if (task.value.status !== 'ACTIVE') return;

  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('id', task.value.id);
}
</script>

<template>
  <AddTask
    v-if="isEditEnabled"
    :task="task"
    @save="save"
    @cancel="isEditEnabled = false"
  />
  <div class="task-item" draggable="true" @dragstart="onDragStart" v-else>
    <div class="row">
      <p class="task-title">{{ task.title }}</p>
    </div>
    <div class="row" v-if="task.description">
      <p class="task-description">{{ task.description }}</p>
    </div>
    <div class="task-actions" v-if="isTodayTask">
      <button
        class="btn check-btn tooltip"
        v-if="task.status === 'ACTIVE'"
        @click="update('COMPLETED')"
        data-tooltip-value="Mark as Complete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"
          />
        </svg>
      </button>
      <button
        class="btn edit-btn tooltip"
        v-if="task.status === 'ACTIVE'"
        @click="isEditEnabled = true"
        data-tooltip-value="Edit Task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          />
        </svg>
      </button>
      <button
        class="btn push-btn push-back-btn tooltip"
        @click="update('ACTIVE')"
        v-if="['COMPLETED', 'PUSHED'].includes(task.status)"
        data-tooltip-value="Bring Back to Active"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M11.46,8.29a1,1,0,0,0-1.42,0l-3,3a1,1,0,0,0,0,1.42l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.16,12l2.3-2.29A1,1,0,0,0,11.46,8.29ZM14.66,12,17,9.71a1,1,0,0,0-1.42-1.42l-3,3a1,1,0,0,0,0,1.42l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
          />
        </svg>
      </button>
      <button
        class="btn push-btn tooltip"
        @click="update('PUSHED')"
        v-if="task.status === 'ACTIVE'"
        data-tooltip-value="Push to Tomorrow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M7,17a1,1,0,0,1-.71-1.71L9.59,12,6.29,8.71A1,1,0,0,1,7.71,7.29l4,4a1,1,0,0,1,0,1.41l-4,4A1,1,0,0,1,7,17Z"
          />
          <path
            d="M13,17a1,1,0,0,1-.71-1.71L15.59,12,12.29,8.71a1,1,0,0,1,1.41-1.41l4,4a1,1,0,0,1,0,1.41l-4,4A1,1,0,0,1,13,17Z"
          />
        </svg>
      </button>
      <button
        class="btn remove-btn tooltip"
        @click="update('REMOVED')"
        data-tooltip-value="Remove"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_6_6)">
            <path
              d="M6 19C6 20.105 6.895 21 8 21H16C17.105 21 18 20.105 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_6_6">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 12px 20px 16px;
  background-color: hsl(200, 6%, 8%);
  box-shadow: 0 0 2px 0.75px rgb(51, 51, 51);
  cursor: pointer;
}

.task-title {
  font-size: rem(18);
  font-weight: 600;
  line-height: 1.6;
  color: $text-white;
}

.task-description {
  font-size: rem(16);
  font-weight: 400;
  line-height: 1.6;
  color: $muted-white;
  margin: 4px 0 8px;
}

.task-actions {
  display: flex;
  height: 28px;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  margin-left: auto;

  .task-item:hover & {
    opacity: 1;
    pointer-events: all;
  }

  button {
    background-color: $icon-grey;
    border-radius: 50%;
    height: 28px;
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 2px rgb(51, 51, 51);
  }

  .check-btn {
    background-color: $muted-green;

    svg path {
      fill: $primary-green;
    }
  }

  .edit-btn {
    background-color: $muted-blue;

    svg path {
      fill: $primary-blue;
    }
  }

  .push-btn {
    background-color: $muted-orange;

    svg path {
      fill: $primary-orange;
    }
  }

  .remove-btn {
    background-color: $muted-red;

    svg path {
      fill: $primary-red;
    }
  }

  .btn:hover {
    opacity: 0.5;
  }
}

.tooltip {
  position: relative;

  &::before {
    position: absolute;
    width: fit-content;
    top: calc(100% + 4px);
    right: 100%;
    background-color: #000;
    color: #fff;
    border: 1px solid #2c3333;
    padding: 4px 6px;
    opacity: 1 !important;
    white-space: nowrap;
  }

  &:hover::before {
    content: attr(data-tooltip-value);
  }
}
</style>
