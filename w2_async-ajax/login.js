import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data() {
        return {
            baseUrl: 'https://vue3-course-api.hexschool.io/v2',
            // apiPath: 'haojing',
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
            const api = `${this.baseUrl}/admin/signin`;
            axios.post(api, this.user)
                // 成功的話
                .then((res) => {
                    // 取出token和expired的值
                    const { token, expired } = res.data;

                    // 取出token和expired的值後 儲存至cookie; 設定token期限
                    document.cookie = `haojingToken=${token}; expires=${new Date(expired)};`;
                    console.log(res);
                    // 全域至products頁面
                    window.location = 'products.html';
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    console.log(err);
                });
        }
    }
}).mount('#app');