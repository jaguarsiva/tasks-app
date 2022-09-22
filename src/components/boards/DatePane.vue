<script setup lang="ts">
import { ref, computed } from 'vue';
import useUserStore from '~/stores/user';

interface Props {
  dateChosen: Date;
}

const props = defineProps<Props>();
const emit = defineEmits(['update']);

const user = useUserStore();

const dateChosenFormatted = computed(() => {
  return props.dateChosen.toLocaleString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const boardName = computed(() => {
  if (user.firstName) return `${user.firstName}'s Board`;
  return '';
});

function changeDate(type: string) {
  const currentDateValue = props.dateChosen.getDate();
  const updatedDateValue =
    type === 'increment' ? currentDateValue + 1 : currentDateValue - 1;
  const updatedDateInMs = new Date().setDate(updatedDateValue);
  const updatedDate = new Date(updatedDateInMs);
  emit('update', updatedDate);
}
</script>

<template>
  <section class="date-pane">
    <span class="board-name" v-if="boardName">{{ boardName }}</span>
    <div class="skeleton skeleton-line" v-else></div>

    <ul class="date-actions">
      <li>
        <button class="btn prev-btn" @click="changeDate('decrement')">
          <svg
            width="11"
            height="16"
            viewBox="0 0 11 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.30583 8.70191C1.31783 8.71191 1.33383 8.71591 1.34583 8.72591L9.05983 15.7079C9.49383 16.0979 10.1978 16.0979 10.6318 15.7079C10.6358 15.7039 10.6378 15.6999 10.6398 15.6959C10.7449 15.6091 10.8298 15.5005 10.8885 15.3775C10.9472 15.2545 10.9784 15.1202 10.9798 14.9839L10.9798 1.01791C10.9776 0.879138 10.9449 0.742547 10.8841 0.61779C10.8233 0.493033 10.7358 0.383154 10.6278 0.295914L10.6318 0.291914C10.4135 0.103174 10.1345 -0.000686646 9.84583 -0.000686646C9.5572 -0.000686646 9.2782 0.103174 9.05983 0.291914L1.30583 7.28991C1.20371 7.37703 1.1217 7.48527 1.06547 7.60716C1.00923 7.72904 0.980114 7.86168 0.980114 7.99591C0.980114 8.13015 1.00923 8.26278 1.06547 8.38467C1.1217 8.50656 1.20371 8.61479 1.30583 8.70191V8.70191Z"
              fill="white"
            />
          </svg>
        </button>
      </li>
      <li>
        <span class="date-value">{{ dateChosenFormatted }}</span>
      </li>
      <li>
        <button class="btn next-btn" @click="changeDate('increment')">
          <svg
            width="11"
            height="16"
            viewBox="0 0 11 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6541 7.29781C10.6421 7.28781 10.6261 7.28381 10.6141 7.27381L2.9001 0.291812C2.4661 -0.098188 1.7621 -0.098188 1.3281 0.291812C1.3241 0.295812 1.3221 0.299811 1.3201 0.303811C1.21501 0.390582 1.13014 0.499255 1.07141 0.622235C1.01269 0.745216 0.981524 0.879536 0.980103 1.01581L0.980103 14.9818C0.982345 15.1206 1.01503 15.2572 1.07586 15.3819C1.13668 15.5067 1.22415 15.6166 1.3321 15.7038L1.3281 15.7078C1.54647 15.8966 1.82547 16.0004 2.1141 16.0004C2.40274 16.0004 2.68173 15.8966 2.9001 15.7078L10.6541 8.70981C10.7562 8.62269 10.8382 8.51445 10.8945 8.39257C10.9507 8.27068 10.9798 8.13805 10.9798 8.00381C10.9798 7.86958 10.9507 7.73694 10.8945 7.61506C10.8382 7.49317 10.7562 7.38493 10.6541 7.29781V7.29781Z"
              fill="white"
            />
          </svg>
        </button>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.date-pane {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 60px;
}

.board-name {
  font-size: rem(20);
  font-weight: 500;
  line-height: 1;
}

.skeleton-line {
  width: 140px;
  height: 20px;
}

.date-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.date-value {
  display: inline-block;
  font-size: rem(18);
  font-weight: 500;
  width: 300px;
  text-align: center;
}
</style>
