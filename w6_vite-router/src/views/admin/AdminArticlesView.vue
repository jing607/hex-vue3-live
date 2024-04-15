<template>
    <h2>Articles</h2>
    <div>
    <VueLoading :active="isLoading" :z-index="1060" />
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openArticleModal(true,item)">
        建立新的頁面
      </button>
    </div>
    <table class="table mt-4">
        <thead>
        <tr>
            <th style="width: 200px">標題</th>
            <th style="width: 200px">作者</th>
            <th>描述</th>
            <th style="width: 100px">建立時間</th>
            <th style="width: 100px">是否公開</th>
            <th style="width: 120px">編輯</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in articles" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.description }}</td>
            <td>{{ $filters.date(item.create_at) }}</td>
            <td>
            <span v-if="item.isPublic">已上架</span>
            <span v-else>未上架</span>
            </td>
            <td>
            <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm" type="button" @click="openArticleModal(false,item)">
                編輯
                </button>
                <button class="btn btn-outline-danger btn-sm" type="button" @click="openDelArticleModal(item)">
                刪除
                </button>
            </div>
            </td>
        </tr>
        </tbody>
    </table>
    
    <PaginationComponent :pages="pagination" @emit-pages="getArticles"/>
    <DelModal :item="tempArticle" ref="delModal" @del-item="delArticle" />
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useToastMessageStore } from '@/stores/toastMessage';
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env

import DelModal from '@/components/DelModal.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
    data() {
        return {
            articles: [],
            isLoading: false,
            tempArticle: {},
            pagination: {},
            currentPage: 1,
            isNew: false,
        }
    },
    components: {

        DelModal,
        PaginationComponent,
    },
    methods: {
        ...mapActions(useToastMessageStore, ['pushMessage']),
        getArticles(page=1) {
            const api = `${VITE_URL}/api/${VITE_PATH}/admin/articles?page=${page}`;
            this.currentPage = page;
            this.isLoading = true;
            axios.get(api)
                .then((res) => {
                    this.isLoading = false;
                    this.articles = res.data.articles;
                }).catch((err) => {
                    this.isLoading = false;
                    this.pushMessage({
                    title: '取得文章資訊失敗',
                    style: 'danger',
                    content: err.response.data.message,
                    })
                })
        },
        openArticleModal(isNew,item) {
            console.log('clicked!');
        },
        openDelArticleModal(item) {

        },
        delArticle() {

        },
    },
    created() {
        this.getArticles();
    },
}

</script>