<template>
  <h2>Cart here</h2>
  
  <div class="text-end">
    <button class="btn btn-outline-danger" type="button" @click="removeAllCartItems">清空購物車</button>
  </div>
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th>單價</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="cart in carts.carts" :key="cart.id">
        <tr>
          <td>
            <button type="button" class="btn btn-outline-danger btn-sm"
              @click="removeCartItem(cart.id)"
              :disabled="loadingStatus.cartQtyLoading === cart.id">
              x
            </button>
          </td>
          <td>
            {{ cart.product.title }}
          </td>
          <td>
            <div class="input-group input-group-sm">
              <div class="input-group mb-3">
                <button type="button" class="btn btn-outline-primary" :disabled="cart.qty === 1"
                  @click="cart.qty--; changeCartQty(cart, cart.qty)"
                  v-if="cart.qty > 1"> - </button>
                <button type="button" class="btn btn-outline-danger"
                  @click="removeCartItem(cart.id)"
                  v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg> </button>
                <input min="1" type="number" class="form-control" 
                  v-model="cart.qty"
                  :disabled="cart.id === loadingStatus.cartQtyLoading"
                  readonly
                />
                <button type="button" class="btn btn-outline-primary"
                  @click="cart.qty++; changeCartQty(cart, cart.qty)"> + </button>
              </div>
            </div>
          </td>
          <td class="text-end">
            {{ (cart.total)?.toFixed(2) }} €
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="text-end">總計</td>
        <td class="text-end">{{ (carts.final_total)?.toFixed(2) }} €</td>
      </tr>
    </tfoot>
  </table>

  <!-- form -->
  <div class="my-5 row justify-content-center">
    <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <v-field 
          id="email" 
          name="email" 
          type="email" 
          class="form-control"
          :class="{ 'is-invalid': errors['email'] }" 
          rules="email|required"
          v-model="form.user.email"
          placeholder="請輸入 Email" 
        ></v-field>
        <error-message name="email" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <v-field 
          id="name" 
          name="姓名" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors['姓名'] }"
          rules="required"
          v-model="form.user.name"
          placeholder="請輸入姓名" 
        ></v-field>
        <error-message name="姓名" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <v-field 
          id="tel" 
          name="電話" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors['電話'] }"
          rules="required|min:8|max:10" 
          v-model="form.user.tel"
          placeholder="請輸入電話" 
        ></v-field>
        <error-message name="電話" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <v-field 
          id="address" 
          name="地址" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors['地址'] }"
          rules="required" 
          v-model="form.user.address"
          placeholder="請輸入地址" 
        ></v-field>
        <error-message name="地址" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea 
          id="message" 
          class="form-control" 
          cols="30" rows="10" 
          v-model="form.message"
        ></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger">送出訂單</button>
      </div>
    </v-form>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  const {VITE_URL, VITE_PATH} = import.meta.env
  
  export default {
    data() {
      return {
        carts: {},
        loadingStatus: {
          cartQtyLoading: '',
        },
        form: {
          user: {
            name: "",
            email: "",
            tel: "",
            address: "",
          },
          message: "",
        },
      }
    },

    methods: {
      changeCartQty(item, qty = 1) {
        const api = `${VITE_URL}/api/${VITE_PATH}/cart/${item.id}`;
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
        const api = `${VITE_URL}/api/${VITE_PATH}/cart/${id}`;
        this.loadingStatus.cartQtyLoading = id;
        axios.delete(api)
            .then(res => {
                alert('已成功移除商品');
                this.loadingStatus.cartQtyLoading = '';
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
      },
      removeAllCartItems() {
        const api = `${VITE_URL}/api/${VITE_PATH}/carts`;
        axios.delete(api)
            .then(res => {
                alert('已清空購物車');
                this.getCart();
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
      },
      getCart() { // 將購物車的資料傳遞進來
        const api = `${VITE_URL}/api/${VITE_PATH}/cart`;
        axios.get(api)
            .then(res => {
                this.carts = res.data.data;
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
      },

      createOrder() {
        const api = `${VITE_URL}/api/${VITE_PATH}/order`;
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

    mounted() {
        this.getCart();
    },
  }
  
  </script>
  
  <style>
  </style>
  