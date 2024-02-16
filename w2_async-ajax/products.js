import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
      return {
          baseUrl: 'https://vue3-course-api.hexschool.io/v2',
          apiPath: 'haojing',
          products: [],
          showProduct: {},
      }
  },
  methods: {
    checkUser() {
      const api = `${this.baseUrl}/api/user/check`;
      axios.post(api)
        .then(api => {
          this.getData();
        })
        .catch(err => {
          window.location = 'login.html';
        })
    },

    getData() {
      const api = `${this.baseUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(api)
        .then(res => {
          this.products = res.data.products;
        })
    }
  },
  mounted() {
    // 取得token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)haojingToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    // 管理控制台的api必須帶入token，要帶入header裡
    axios.defaults.headers.common['Authorization'] = token;

    // this.getData();
    this.checkUser();
  }

}).mount('#app');


