# Vue Multiple Datepicker


<img src="./resources/single.png" width="40%">
<hr>
<img src="./resources/multiple-drag.png" width="40%"/>
<hr>
<img src="./resources/date-range.png" width="50%">

### Using

**Installing**

```bash
npm install vue-date-picker
```

**Import to Project**

```javascript
// main.js file
import DatePicker from 'vue-date-picker';
Vue.component('Datepicker', DatePicker)
```


```vue
<script>
  import Datepicker from 'vue-date-picker';
  export default {
    components: {
      Datepicker
    }
  }
</script>
```
and

### Props
``` html
   <Datepicker 
        range: Boolean,
        multipleDrag: Boolean,
        maxDate: [String, Number, Date],
        minDate: [String, Number, Date],
        disable: Boolean,
        title: String
   />
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
