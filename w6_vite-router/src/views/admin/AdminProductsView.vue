<template>
  <h2>Product list</h2>
  
  <div class="container">
    <div class="text-end mt-4">
      <button 
        @click="openModal(true)" 
        class="btn btn-dark">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>
            產品名稱
          </th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>
            {{ item.category }}
          </td>
          <td>
            {{ item.title }}
          </td>
          <td class="text-end">
            {{ item.origin_price }}
          </td>
          <td class="text-end">
            {{ item.price }}
          </td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button 
                @click="openModal(false, item)"
                type="button" 
                class="btn btn-outline-primary btn-sm">
                編輯
              </button>
              <button 
                @click="openDelProductModal(item)"
                type="button" 
                class="btn btn-outline-danger btn-sm">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <PaginationComponent :pages="pagination" @emit-pages="getProducts"/>
    <ProductModal
      @update-product="updateProduct"
      :product="tempProduct"
      :isNew="isNew"
      ref="productModal"
    />
    <DelModal :item="tempProduct" ref="delModal" @del-item="delProduct" />
  </div>
</template>
  
<script>
import ProductModal from '@/components/admin/ProductModal.vue';
import DelModal from '@/components/DelModal.vue'
import PaginationComponent from '@/components/PaginationComponent.vue';
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env

export default {
  data() {
    return {
      products: [],
      pagination: {},
      currentPage: 1,
      tempProduct: {},
      isNew: false,
      // isLoading: false, 
      status: {
        fileUploading: false,
      },
      modal: {
        editModal: '',
        delModal: '',
      },
    }
  },
  components: {
    ProductModal,
    PaginationComponent,
    DelModal,
  },

  methods: {
    getProducts(page=1) { // 參數預設值
      const api = `${VITE_URL}/api/${VITE_PATH}/admin/products?page=${page}`; // ? 是query + 參數
      this.currentPage = page;
      axios.get(api)
        .then(res => {
          console.log(res);
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch(err => {
          alert(err.response.data.message);
        })
    },
    // 新增 與 編輯 共用 openModal
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
      } else {
        this.tempProduct = {...item};
        this.isNew = false;
      }
      // 這裡參考範例。若不想新寫一個 const，也可分別寫入條件式裡 `this.$refs.productModal.openModal();`
      const productComponent = this.$refs.productModal;
      productComponent.openModal();
    },
    updateProduct(item) {
      this.tempProduct = item;
      // 新增
      let api = `${VITE_URL}/api/${VITE_PATH}/admin/product`;
      let method = 'post';
      let status = '新增產品';
      // 更新
      if (!this.isNew) {
        api = `${VITE_URL}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`;
        method = 'put';
        status = '更新產品';
      }
      const productComponent = this.$refs.productModal;
      // 原本是 axios.post()寫法，宣告 method 後可直接取用，這樣不用寫兩遍
      axios[method](api, { data: this.tempProduct }) // post要夾帶資料，並要確認資料格式
        .then(res => {
          // 建立完新產品後需要再取得列表 getProducts，確保資料有新增
          alert('新增產品成功')
          productComponent.hideModal();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
      
    },
    openDelProductModal(item) {
      this.tempProduct = {...item};
      const delComponent = this.$refs.delModal;
      delComponent.openModal(); 
    },
    delProduct() {
      const api = `${VITE_URL}/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`;
      const productComponent = this.$refs.delModal;
      axios.delete(api)
        .then((res) => {
          this.getProducts();
          productComponent.hideModal();
          alert('刪除成功')
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
  },

  created() {
    this.getProducts()
  },
  
}

</script>

<style>
</style>
  