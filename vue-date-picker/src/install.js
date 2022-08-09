import Datepicker from "./components/DatePicker.vue";

const MultipleDatePicker = {
 install(Vue) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component("date-picker", Datepicker);
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MultipleDatePicker);
}

export default MultipleDatePicker;