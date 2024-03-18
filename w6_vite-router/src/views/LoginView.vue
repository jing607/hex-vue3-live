<template>
    <h2>Login</h2>

    <div class="container">
        <div class="row justify-content-center">
        <h1 class="h3 mb-3 font-weight-normal">
            請先登入
        </h1>
        <div class="col-8">
            <!-- submit事件將不再重新加載頁面 -->
            <form @submit.prevent="login" id="form" class="form-signin">
            <div class="form-floating mb-3">
                <input 
                    v-model="user.username"
                    type="email" 
                    class="form-control" 
                    id="username"
                    placeholder="name@example.com" 
                    required 
                    autofocus
                >
                <label for="username">Email address</label>
            </div>
            <div class="form-floating">
                <input 
                    v-model="user.password"
                    type="password" 
                    class="form-control" 
                    id="password"
                    placeholder="Password" 
                    required
                >
                <label for="password">Password</label>
            </div>
            <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
                登入
            </button>
            </form>
        </div>
        </div>
        <p class="mt-5 mb-3 text-muted">
        &copy; 2021~∞ - 六角學院
        </p>
    </div>
</template>

<script>
import axios from 'axios';
const {VITE_URL} = import.meta.env

export default {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
            const api = `${VITE_URL}/admin/signin`;
            axios.post(api, this.user)
                .then((res) => {
                    // 取出token和expired的值
                    const { token, expired } = res.data;
                    // 取出token和expired的值後 儲存至cookie; 設定token期限
                    document.cookie = `haojingToken=${token}; expires=${new Date(expired)};`;
                    this.$router.push('/admin/products')
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        }
    }

}
</script>