import { createApp } from 'vue'

import { createPinia } from 'pinia'

import 'bootstrap/scss/bootstrap.scss' 
import 'bootstrap-icons/font/bootstrap-icons.css'

import Loading from 'vue-loading-overlay';

import CKEditor from '@ckeditor/ckeditor5-vue';

import { // 引入 VeeValidate 元件跟功能
    Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as AllRules from '@vee-validate/rules'; // 引入 VeeValidate 的驗證規則
import { localize, setLocale } from '@vee-validate/i18n'; // 引入 VeeValidate 的 i18n 功能
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'; // 引入 VeeValidate 的繁體中文語系檔

import { date, currency } from '@/methods/filters';

import App from './App.vue'
import router from './router'


Object.keys(AllRules).forEach((rule) => { // 用 Object.keys 將 AllRules 轉陣列並用迴圈將驗證規則加入 VeeValidate
    defineRule(rule, AllRules[rule]);
});


configure({ // 將當前 VeeValidate 的語系設定為繁體中文
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true,
});
setLocale('zh_TW');

const pinia = createPinia();

const app = createApp(App)

// import filter 後註冊
app.config.globalProperties.$filters = {
    date,
    currency,
};

app.component('VueLoading', Loading);
app.use(pinia);
app.use(CKEditor);
// 掛載 Global 的 VeeValidate 元件
app.component('VField', Field);
app.component('VForm', Form);
app.component('ErrorMessage', ErrorMessage);
app.use(router)

app.mount('#app')
