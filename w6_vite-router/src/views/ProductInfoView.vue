<template>
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{ product.title }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-6 ">
                <img class="card-img-top primary-image" :src="product.imageUrl" alt="主圖">
              </div>
              <div v-for="img in product.imagesUrl" :key="img" class="mb-3 img-container">
                <img :src="img" alt="" class="images m-2 col-sm-6 ">
              </div>

              <div class="col-sm-6">
                <span class="badge bg-primary rounded-pill">{{ product.category }}</span>
                <p>商品描述：{{ product.description }}</p>
                <p>商品內容：{{ product.content }}</p>
                <div class="h5" v-if="product.origin_price === product.price">{{ product.origin_price }} €</div>
                <div v-else>
                  <del class="h6">原價 {{ product.origin_price}} €</del>
                  <div class="h5">現在只要 {{ product.price }} €</div>
                </div>
                
                <div>
                  <div class="input-group">
                    <select class="form-select" v-model="qty">
                      <option :value="i" v-for="i in 20" :key="i">{{ i }}</option>
                    </select>
                    <button type="button" class="btn btn-primary" @click="addToCart(product.id, qty)" :disabled="product.id === loadingStatus.addCartLoading">
                      <span class="spinner-border spinner-border-sm" aria-hidden="true"
                        v-if="product.id === loadingStatus.addCartLoading"></span>
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env
export default {
    data() {
        return {
            product: {},
            qty: 1,
            loadingStatus: {
              addCartLoading: '',
            },
        };
    },
    methods: {
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
    watch: {
        product() {
            this.qty = 1;
        }
    },
    // template: "#userProductModal",
    mounted() {
        // this.productModal = new bootstrap.Modal(this.$refs.modal)
        const {id} = this.$route.params;
        console.log(this.$route); // 物件，網址上的參數
        console.log(this.$router); // 方法，可以呼叫的函式

        const api = `${VITE_URL}/api/${VITE_PATH}/product/${id}`;
      
        axios.get(api)
        .then(res => {
            console.log(res);
            this.product = res.data.product
        })
        .catch(err => {
        alert(err.response.data.message);
        })
    }

}


</script>

<style scoped>
img {
  object-fit: contain;
  max-width: 100%;
}

.primary-image {
  height: 300px;
}

.img-container {
  width: 150px; 
  height: 150px; 
  overflow: hidden; 
}

.img-container .images {
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}
/* .images {
  height: 150px;
} */
</style>