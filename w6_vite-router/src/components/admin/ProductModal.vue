<template>
  <div id="productModal" ref="modal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">主要圖片</label>
                  <input 
                    v-model="tempProduct.imageUrl" 
                    id="imageUrl"
                    type="text" 
                    class="form-control" 
                    placeholder="請輸入圖片連結"
                  >
                </div>
                <div class="mb-3">
                  <label for="customFile" class="form-label">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input 
                    type="file" 
                    id="customFile" 
                    class="form-control" 
                    ref="fileInput" 
                    @change="uploadFile"
                  >
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl">
              </div>
              <h4 class="mb-3">多圖新增</h4>

              <!-- 判斷 tempProduct.imagesUrl 是一個陣列，如果是陣列，才會被顯示 能夠被新增 -->
              <template v-if="tempProduct.imagesUrl">
                <div v-for="(img, key) in tempProduct.imagesUrl" :key="key + 123">
                  <img :src="img" class="img-fluid">
                  <input 
                    v-model="tempProduct.imagesUrl[key]"
                    type="text" 
                    class="form-control"
                  >
                </div>
                
                <div v-if="tempProduct.imagesUrl.length === 0 || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                  <button 
                    @click="tempProduct.imagesUrl.push('')" 
                    class="btn btn-outline-primary btn-sm d-block w-100">
                    <!-- vif意思是，沒有圖片 或 最後一個有值的情況下（或者說沒有空的input時） -->
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button 
                    @click="tempProduct.imagesUrl.pop('')" 
                    class="btn btn-outline-danger btn-sm d-block w-100">
                    刪除圖片
                  </button>
                </div>
              </template>
              <div v-else>
                <button @click="createImages" class="btn btn-outline-primary btn-sm d-block w-100">
                  新增圖片
                </button>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input 
                  id="title" 
                  v-model="tempProduct.title"
                  type="text" 
                  class="form-control" 
                  placeholder="請輸入標題"
                >
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input 
                    id="category" 
                    v-model="tempProduct.category"
                    type="text" 
                    class="form-control" 
                    placeholder="請輸入分類"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label for="unit" class="form-label">單位</label>
                  <input 
                    id="unit" 
                    v-model="tempProduct.unit"
                    type="text" 
                    class="form-control" 
                    placeholder="請輸入單位"
                  >
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input 
                    id="origin_price" 
                    v-model.number="tempProduct.origin_price"
                    type="number" 
                    min="0" 
                    class="form-control" 
                    placeholder="請輸入原價"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input 
                    id="price" 
                    v-model.number="tempProduct.price"
                    type="number" 
                    min="0" 
                    class="form-control" 
                    placeholder="請輸入售價"
                  >
                </div>
              </div>
              <hr>

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea 
                  id="description" 
                  v-model="tempProduct.description"
                  type="text" 
                  class="form-control" 
                  placeholder="請輸入產品描述">
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea 
                  id="content" 
                  v-model="tempProduct.content"
                  type="text" 
                  class="form-control" 
                  placeholder="請輸入說明內容">
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    id="is_enabled" 
                    v-model="tempProduct.is_enabled"
                    class="form-check-input" 
                    type="checkbox" 
                    :true-value="1" 
                    :false-value="0"
                  >
                  <label class="form-check-label" for="is_enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button 
            @click="$emit('update-product', tempProduct)"
            type="button" 
            class="btn btn-primary">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import modalMixin from '@/mixins/modalMixin';
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env

export default {
    props: {
      product: Object,
      isNew: Boolean,
    },
    data() {
        return {
          status: {},
          modal: '',
          tempProduct: {},
        };
    },
    emits: ['update-product'],
    mixins: [modalMixin],
    watch: { // 用 watch 判断如果 product 發生變化時，才將其值賦予 tempProduct 以保證 tempProduct的值始终與 product 同步
      product() {
        this.tempProduct = this.product;
        // 判斷 imagesUrl 是不是陣列，不是的話就補進去。這樣無論是否有資料都可新增
        if (!this.tempProduct.imagesUrl) {
          this.tempProduct.imagesUrl = [];
        }
        if (!this.tempProduct.imageUrl) {
          this.tempProduct.imageUrl = '';
        }
      },
    },
    methods: {
      uploadFile() {
        const uploadedFile = this.$refs.fileInput.files[0]; // 先宣告一個變數來儲存找到的圖片
        const formData = new FormData(); // 把圖片轉換成 FromData; 
        formData.append('file-to-upload', uploadedFile); // 將上傳文件用 append 的方式添加到 FormData 對象中，名為'file-to-upload'為後端決定的資料屬性
        const api = `${VITE_URL}/api/${VITE_PATH}/admin/upload`;
        this.status.fileUploading = true; // 表示文件正在上傳中
        axios.post(api, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data', // 因為是以 FormData的格式傳送，所以要更改成 FormData 的傳遞格式
          },
        }).then((res) => {
          this.status.fileUploading = false;
          this.tempProduct.imageUrl = res.data.imageUrl;
          this.$refs.fileInput.value = '';
        }).catch((err) => {
          this.status.fileUploading = false;
          console.log(err.response.data.message);
        })
      },
    }
}
</script>