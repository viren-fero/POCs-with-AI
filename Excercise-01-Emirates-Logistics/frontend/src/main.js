import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import router from './router';
import './assets/main.css';

// Import PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import Timeline from 'primevue/timeline';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import SelectButton from 'primevue/selectbutton';
import Chart from 'primevue/chart';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);

app.directive('tooltip', Tooltip);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.p-dark'
    }
  }
});

// Register Components Globally
app.component('Button', Button);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Select', Select);
app.component('DatePicker', DatePicker);
app.component('Timeline', Timeline);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('Tag', Tag);
app.component('ProgressBar', ProgressBar);
app.component('SelectButton', SelectButton);
app.component('Chart', Chart);

app.mount('#app');


