// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const { createApp } = Vue;


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

const userModal = {
    props: ['tempProduct','addToCart'],
    data() {
        return {
            productModal: null,
            qty: 1,
        };
    },
    methods: {
        open() {
            this.productModal.show()
        }
    },
    watch: {
        tempProduct() {
            this.qty = 1;
        }
    },
    template: "#userProductModal",
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.modal)
    }
}

const app = createApp ({
    data() {
        return {
            products: [],
            tempProduct: {},
            loadingStatus: {
                addCartLoading: '',
                cartQtyLoading:'',
            },
            carts: {},
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
          openModal(product) {
            this.tempProduct = product;
            this.$refs.userModal.open();
          },
          addToCart (product_id, qty = 1) { // qty = 1 是參數預設值
            const api = `${baseUrl}/api/${apiPath}/cart`;
            // 宣告 order 用於存放串接 API 需要的資料
            const order = {
                product_id,
                qty,
            };
            // loading...把它指向當前 id
            this.loadingStatus.addCartLoading = product_id;
            axios.post(api, { data: order })
                .then(res => {
                    console.log(res.data);
                    // alert('商品成功加入購物車');
                    // 在商品加入完成後再把 loading 清掉，恢復成未點擊的樣子
                    this.loadingStatus.addCartLoading = 'product_id';

                    // console.log(this.$refs.userModal);
                    this.$refs.userModal.close();
                    
                    this.getCart(); // 重新渲染購物車的資訊 
                })
                // .catch(err => {
                //     alert(err);
                // })
          },
          changeCartQty(item, qty = 1) {
            const api = `${baseUrl}/api/${apiPath}/cart/${item.id}`;
            const order = {
                product_id: item.product_id,
                qty,
            };
            // loading...
            this.loadingStatus.cartQtyLoading = item.id;
            axios.put(api, {data: order})
                .then(res => {
                    console.log(res);
                    this.loadingStatus.cartQtyLoading = 'item.id';
                    this.getCart(); // 重新渲染購物車的資訊 如 總價
                })
                .catch(err => {
                    alert(err);
                })
          },
          removeCartItem(id) {
            const api = `${baseUrl}/api/${apiPath}/cart/${id}`;
            this.loadingStatus.cartQtyLoading = id;
            axios.delete(api)
                .then(res => {
                    console.log(res);
                    this.loadingStatus.cartQtyLoading = '';
                    this.getCart();
                })
          },
          getCart() {
            const api = `${baseUrl}/api/${apiPath}/cart`;
            axios.get(api)
                .then(res => {
                    console.log(res);
                    this.carts = res.data.data;
                    console.log(this.carts);
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
          },

          createOrder() {
            const api = `${baseUrl}/api/${apiPath}/order`;
            const order = this.form; // 宣告 order 存放串接 api 所需的表單資料
            axios.post(api, {data: order})
                .then(res => {
                    alert(res.data.message);
                    this.$refs.form.resetForm(); // 成功後用 resetForm() 清除表單內容
                    this.getCart(); //最後再次渲染購物車
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
          },
    },
    components: {
        userModal,
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})

// Register components globally
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app')