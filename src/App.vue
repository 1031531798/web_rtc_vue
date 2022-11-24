<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/room">Room</router-link>
    <ThemeSwitch />
  </nav>
  <router-view/>
</template>
<script lang="ts" setup>
import ThemeSwitch from '@/components/themeMode/ThemeSwitch'
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text-1);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: $bg-home;
  width: 100%;
  height: 100%;
}

nav {
  padding: 20px;

  a {
    font-weight: bold;
    color: var(--color-text-1);

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
