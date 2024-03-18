<template>
  <h1>Admin Dashboard</h1>
  <nav>
      <RouterLink to="/admin/products">Products</RouterLink> |
      <RouterLink to="/admin/order">Order</RouterLink> |
      <RouterLink to="/">Back to front</RouterLink>
      |
      <!-- <RouterLink to="/">Log out</RouterLink> -->
      <a href="#" @click.prevent="signout">Sign out</a>
  </nav>
  <!-- checkSuccess 後才可以看到 dashboard -->
  <RouterView v-if="checkSuccess"></RouterView>
</template>

<script>
import axios from 'axios';
const {VITE_URL} = import.meta.env

export default {
  data() {
    return {
      checkSuccess: false,
    }
  },
  methods: {
    checkUser() {
      const api = `${VITE_URL}/api/user/check`;
      // 從 cookie 中取得token
      const token = document.cookie.replace( 
        /(?:(?:^|.*;\s*)haojingToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );

      if (token) {
        // 設置預設的 Authorization header
        axios.defaults.headers.common['Authorization'] = `${token}`;
        axios.post(api,{ api_token: this.token })
          .then((res) => {
            console.log('驗證成功',res.data.success);
            this.checkSuccess = true
          })
          .catch((err) => {
            alert(err)
            this.$router.push('/login')
          }) 
      } else {
        alert("請先登入")
        this.$router.push('/login')
      }
    },
    signout() {
      document.cookie = "haojingToken=;expires=;";
      alert("Signed out");
      this.$router.push("/login");
    }
  },
  mounted() {
    this.checkUser();
  }
}

</script>

<style>
</style>
