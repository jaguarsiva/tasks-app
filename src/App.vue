<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import router from '~/router';

onMounted(async () => {
  const userId = localStorage.getItem('userId');
  console.log({ userId });

  if (userId) {
    router.push('/boards');
  } else {
    router.push('/');
  }
});
</script>

<template>
  <main>
    <RouterView />
  </main>
  <footer>
    <p>
      Made with ❤️ by
      <a
        href="https://sivacodes.in/"
        target="_blank"
        title="Click to open Siva Chandran's Personal Website"
      >
        Siva Chandran
      </a>
    </p>
  </footer>
</template>

<style lang="scss" scoped>
main {
  height: calc(100vh - 60px);
}

footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0 60px;
}

footer p {
  a {
    color: $tomato;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
