import Datepicker from "./components/DatePicker.vue";

const MDatepickerVue = {
 install(Vue) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component("m-datepicker-vue", Datepicker);
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MDatepickerVue);
}

export default MDatepickerVue;