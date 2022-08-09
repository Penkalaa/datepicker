<template>
  <div id="app">
    <div>
      <h3>Range</h3>
      <DatePicker @selectedValue="deneme" :range="true" msg="Welcome to Your Vue.js App" />
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
  methods: {
    deneme(val) {
      console.log(val)
    }
  }
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
