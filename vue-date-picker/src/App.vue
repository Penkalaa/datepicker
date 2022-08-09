<template>
  <div id="app">
    <div>
      <h3>Single</h3>
      <DatePicker msg="Welcome to Your Vue.js App" />
    </div>
    <div>
      <h3>Multiple Drag</h3>
      <DatePicker :multipleDrag="true" msg="Welcome to Your Vue.js App" />
    </div>
    <div>
      <h3>Range</h3>
      <DatePicker :range="true" :maxDate="new Date()" msg="Welcome to Your Vue.js App" />
    </div>
  </div>
</template>

<script>
import DatePicker from "./components/DatePicker.vue";

export default {
  name: "App",
  components: {
    DatePicker,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
}
</style>
