<template>
  <h2>All products here</h2>
  <main class="container">
    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td style="width: 200px">
            <div style="height: 100px; background-size: cover; background-position: center" 
              :style="{backgroundImage: `url(${product.imageUrl})`}"></div>
          </td>
          <td>
            {{ product.title }}
          </td>
          <td>
            <div class="h5" v-if="product.origin_price === product.price">{{ product.origin_price }} €</div>
            <div v-else>
              <del class="h6">原價 {{ product.origin_price }} €</del>
              <div class="h5">現在只要 {{ product.price }} €</div>
            </div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <a href="#" @click.prevent="showProductInfo(product.id)" type="button" class="btn btn-outline-secondary">查看更多</a>
              <button type="button" class="btn btn-outline-danger" 
                :disabled="product.id === loadingStatus.addCartLoading"
                @click="addToCart(product.id)">
                <span class="spinner-border spinner-border-sm" aria-hidden="true"
                  v-if="product.id === loadingStatus.addCartLoading"></span>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </main>
</template>

<script>
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env
export default {
  data() {
        return {
            products: [],
            // tempProduct: {},
            loadingStatus: {
                addCartLoading: '',
                // cartQtyLoading:'',
            },
            // carts: {},
        };
    },
    methods: {
        getProducts() {
            const api = `${VITE_URL}/api/${VITE_PATH}/products/all`;
      
            axios.get(api)
              .then(res => {
                this.products = res.data.products;
              })
              .catch(err => {
                alert(err.response.data.message);
              })
          },
          showProductInfo(id) {
            console.log(id);
            this.$router.push(`/product/${id}`)
          },
          // openModal(product) {
          //   this.tempProduct = product;
          //   this.$refs.userModal.open();
          // },
          addToCart (product_id, qty = 1) { // qty = 1 是參數預設值
            const api = `${VITE_URL}/api/${VITE_PATH}/cart`;
            
            const order = { // 宣告 order 用於存放串接 API 需要的資料 (是這隻 cart api 的結構)
                product_id,
                qty,
            };
            
            this.loadingStatus.addCartLoading = product_id; // loading...把它指向當前 id
            axios.post(api, { data: order })
                .then(res => {
                    // alert('商品成功加入購物車');
                    console.log(res.data);
                    this.loadingStatus.addCartLoading = 'product_id'; // 在商品加入完成後再把 loading 清掉，恢復成未點擊的樣子
                    // this.$refs.userModal.close();
                    // this.getCart(); // 重新渲染購物車的資訊 
                })
                .catch(err => {
                    alert(err);
                })
          },
    },
    components: {
        // userModal,
    },
    mounted() {
        this.getProducts()
    },
}

</script>

<style>
</style>
  