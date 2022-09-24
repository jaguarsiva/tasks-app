<script setup lang="ts">
import { ref } from 'vue';
import api from '~/utils/api';
import type Task from '~/utils/types/Task.type';

interface Props {
  task?: Task;
}

const props = defineProps<Props>();

const emit = defineEmits(['add', 'save', 'cancel']);

const isLoading = ref(false);
const title = ref(props.task ? props.task.title : '');
const description = ref(props.task ? props.task.description : '');

function cancel() {
  emit('cancel');
}

async function add() {
  if (props.task) return save();

  try {
    isLoading.value = true;
    const payload = {
      title: title.value,
      description: description.value
    };
    const response = await api.post('tasks', payload);
    const task = response.data;
    emit('add', task);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

async function save() {
  try {
    isLoading.value = true;
    const payload = {
      title: title.value,
      description: description.value
    };
    const response = await api.patch(`tasks/${props.task?.id}`, payload);
    const task = response.data.task;
    emit('save', task);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="add-item" :class="{ 'is-loading': isLoading }">
    <input
      type="text"
      class="title-input"
      placeholder="Title"
      v-model="title"
    />
    <input
      type="text"
      class="description-input"
      placeholder="Description"
      v-model="description"
    />
    <div class="btns-row">
      <button class="btn add-btn" v-if="title.trim()" @click="add">
        {{ props.task ? 'Save' : 'Add' }}
      </button>
      <button class="btn cancel-btn" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 12px 20px 16px 12px;
  background-color: hsl(200, 6%, 8%);
  box-shadow: 0 0 2px 0.75px rgb(51, 51, 51);
}

input {
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  outline: none;
  margin-bottom: 12px;
  padding: 4px 12px;

  &:focus {
    border-bottom: 2px solid $primary-blue;
  }
}

.title-input {
  font-size: rem(18);
  font-weight: 600;
  color: $text-white;
}

.description-input {
  font-size: rem(16);
  font-weight: 400;
  color: $muted-white;
}

.btns-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  min-width: 60px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: rem(14);
  font-weight: 500;
}

.add-btn {
  color: $muted-green;
  background-color: $primary-green;
}

.cancel-btn {
  color: $muted-red;
  background-color: $primary-red;
}

.is-loading {
  position: relative;
  height: 150px;

  input {
    opacity: 0.5;
    pointer-events: none;
  }

  .btn {
    opacity: 0.5;
    pointer-events: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 0px;
    height: 2px;
    width: 50px;
    background-color: $primary-green;
    animation: move 800ms linear infinite;
  }

  @keyframes move {
    from {
      left: 0px;
    }

    to {
      left: calc(100% - 50px);
    }
  }
}
</style>
