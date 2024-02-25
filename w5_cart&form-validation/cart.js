import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
// import * as VeeValidate from 'https://unpkg.com/vee-validate@next/dist/vee-validate.esm.js';


const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'haojing';

const app = createApp ({
    data() {
        return {
            // loadingStatus: {
            //     loadingItem: '',
            // },
            products: [],
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            }
        };
    },
    component: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getProducts() {
            const api = `${baseUrl}/api/${apiPath}/products/all`;
      
            axios.get(api)
              .then(res => {
                this.products = res.data.products;
              })
              .catch(err => {
                alert(err.response.data.message);
              })
          },
    },
    mounted() {
        this.getProducts()
    },
})

// Register components globally
// app.component('VForm', Form);
// app.component('VField', Field);
// app.component('ErrorMessage', ErrorMessage);
// app.use(VeeValidate);

app.mount('#app')