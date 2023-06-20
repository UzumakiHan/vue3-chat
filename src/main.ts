import { createApp } from 'vue'
import 'vant/lib/index.css';
import '@/scss/app.scss'
import {createPinia} from 'pinia';
import vant from '@/common/vant';
import App from './App.vue'
import router from '@/router'

const app = createApp(App);
app.use(createPinia());
vant.forEach(item => {
    app.use(item);
});

app.use(router)
app.mount('#app')
