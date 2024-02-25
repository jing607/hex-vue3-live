import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'haojing';

import pagination from './pagination.js';
import ProductModal from './ProductModal.js';
import DeleteModal from './DeleteModal.js';

const app = createApp({
  data() {
    return {
      products: [],
      showProduct: {
        imagesUrl: [],
      },
      pages: {},
      modalProduct: null, // productModal
      modalDel: null, // delModal
      isNew: false,
    };
  },

  methods: {
    getProducts(page=1) { // 參數預設值
      const api = `${baseUrl}/api/${apiPath}/admin/products?page=${page}`; // ? 是query + 參數

      axios.get(api)
        .then(res => {
          console.log(res);
          this.products = res.data.products;
          this.pages = res.data.pagination;
        })
        .catch(err => {
          alert(err.response.data.message);
        })
    },

    // 新增 與 編輯 共用 openModal，故要區分所點擊的按鈕目的；另還有 刪除
    openModal(status, product) { // status是 new or edit；product是給編輯 有產品時用的
      if (status === 'new') {
        this.showProduct = {
          imagesUrl: [],
        };
        // 更嚴謹的話要加上 isNew
        this.isNew = true;
        // this.modalProduct.show()
        // 呼叫取得外層refs pModal 去開啟內層元件 openModal
        this.$refs.pModal.openModal();
      } else if (status === 'edit') {
        this.showProduct = { ...product };
        // 判斷 imagesUrl 是不是陣列，不是的話就補進去。這樣無論是否有資料都可新增
        if (!Array.isArray(this.showProduct.imagesUrl)) {
          this.showProduct.imagesUrl = [];
        }
        this.isNew = false;
        // this.modalProduct.show();
        this.$refs.pModal.openModal();
      } else if (status === 'delete') {
        this.showProduct = { ...product };
        // this.modalDel.show();
        this.$refs.dModal.openModal();
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
          // this.modalProduct.hide();
          this.$refs.pModal.closeModal();
          this.showProduct = {};
          alert('新增產品成功')
        })
        .catch(err => {
          alert(err.response.data.message);
        });
    },

    deleteProduct() {
      const api = `${baseUrl}/api/${apiPath}/admin/product/${this.showProduct.id}`;

      axios.delete(api)
        .then((res) => {
          this.getProducts();
          // this.modalDel.hide();
          this.$refs.dModal.closeModal();
          alert('刪除成功')
        })
        .catch(err => {
          alert(err.response.data.message);
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

    // 檢查用戶是否已登入
    if (!token) {
      window.location.href = './login.html';
      return;
    }

    this.getProducts();

  
    
  },
  
  //區域註冊
  components: {
    pagination,
    ProductModal,
    DeleteModal,
  }

});


app.mount('#app');


