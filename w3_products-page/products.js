import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'haojing';

const app = createApp({
  data() {
    return {
      products: [],
      showProduct: {
        imageUrl: '',
      },
      modalProduct: null, // productModal
      modalDel: null, // delModal
      isNew: false,
    };
  },

  methods: {
    getProducts() {
      const api = `${baseUrl}/api/${apiPath}/admin/products`;

      axios.get(api)
        .then(res => {
          this.products = res.data.products;
        })
        .catch(err => {
          console.log(err);
        })
    },

    // 新增 與 編輯 共用 openModal，故要區分所點擊的按鈕目的；另還有 刪除
    openModal(status, product) { // status是 new or edit；product是給編輯 有產品時用的
      if (status === 'new') {
        this.showProduct = {
          imageUrl: [],
        };
        // 更嚴謹的話要加上 isNew
        this.isNew = true;
        this.modalProduct.show()
      } else if (status === 'edit') {
        this.showProduct = { ...product };
        this.isNew = false;
        this.modalProduct.show();
      } else if (status === 'delete') {
        this.showProduct = { ...product };
        this.modalDel.show();
      }
    },

    // 新增 與 編輯 也共用 updateProduct，故要區分送出的 api
    updateProduct() {
      // 新增
      let api = `${baseUrl}/api/${apiPath}/admin/product`;
      let method = 'post';

      // 更新
      if (!this.isNew) {
        api = `${baseUrl}/api/${apiPath}/admin/product/${this.showProduct.id}`;
        method = 'put';
      }

      // 原本是 axios.post()寫法，宣告 method 後可直接取用，這樣不用寫兩遍
      axios[method](api, { data: this.showProduct }) // post要夾帶資料，並要確認資料格式
        .then(res => {
          // 建立完新產品後需要再取得列表 getProducts，確保資料有新增
          this.getProducts();
          this.modalProduct.hide();
          this.showProduct = {};
        })
        .catch(err => {
          console.log(err);
        });
    },

    deleteProduct() {
      const api = `${baseUrl}/api/${apiPath}/admin/product/${this.showProduct.id}`;

      axios.delete(api)
        .then((res) => {
          this.getProducts();
          this.modalDel.hide();
        })
    },
  },

  mounted() {
    // 取得token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)haojingToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    // 管理控制台的api必須帶入token，要帶入header裡
    axios.defaults.headers.common['Authorization'] = token;

    this.getProducts();

    this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
  },

});


app.mount('#app');


