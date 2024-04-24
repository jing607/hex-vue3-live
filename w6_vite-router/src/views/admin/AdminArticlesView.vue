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
                    <button class="btn btn-outline-primary btn-sm" type="button" @click="getArticle(item.id)">
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
        
        <ArticleModal ref="articleModal" :article="tempArticle" :is-new="isNew" @update-article="updateArticle"/>
        <PaginationComponent :pages="pagination" @emit-pages="getArticles"/>
        <DelModal :item="tempArticle" ref="delModal" @del-item="delArticle" />
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useToastMessageStore } from '@/stores/toastMessage';
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env

import ArticleModal from '@/components/admin/ArticleModal.vue';
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
        ArticleModal,
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
        getArticle(id) {// 做到這裡，繼續做 編輯 的modal
            const api = `${VITE_URL}/api/${VITE_PATH}/admin/article/${id}`;
            this.isLoading = true;
            console.log('編輯被選中');
            axios.get(api)
                .then((res) => {
                    this.isLoading = false;
                    this.openArticleModal(false, res.data.article);
                    this.isNew = false;
                }).catch((err) => {
                    this.isLoading = false;
                    this.pushMessage({
                        title: '取得文章資訊失敗',
                        style: 'danger',
                        content: error.response.data.message,
                    })
                });
        },
        openArticleModal(isNew,item) {
            if (isNew) {
                this.tempArticle = {
                    isPublic: false,
                    create_at: new Date().getTime() / 1000,
                    tag: [],
                };
                this.isNew = true;
            } else {
                this.tempArticle = { ...item };
                this.isNew = false;
            }
            this.$refs.articleModal.openModal(); 
        },
        updateArticle(item) {
            this.isLoading = true;
            this.tempArticle = item;
            let api = `${VITE_URL}/api/${VITE_PATH}/admin/article`;
            let method = 'post';
            let status = '新增文章';

            if (!this.isNew) {
                api =`${VITE_URL}/api/${VITE_PATH}/admin/article/${this.tempArticle.id}`;
                method = 'put';
                status = '更新文章';
            }
            axios[method](api, {data: this.tempArticle })
                .then((res) => {
                    this.isLoading = false;
                    this.pushMessage({
                        style: 'success',
                        title: status,
                        content: res.data.message,
                    })
                    this.$refs.articleModal.hideModal();
                    this.getArticles(this.currentPage);
                }).catch((err) => {
                    this.isLoading = false;
                    this.pushMessage({
                    style: 'danger',
                    title: status,
                    content: error.response.data.message,
                    })
                })

        },
        openDelArticleModal(item) {
            this.tempArticle = { ...item };
            this.$refs.delModal.openModal();
        },
        delArticle() {
            const api =`${VITE_URL}/api/${VITE_PATH}/admin/article/${this.tempArticle.id}`;
            this.isLoading = true;
            axios.delete(api)
                .then((res) => {
                    this.isLoading = false;
                    this.pushMessage({
                    style: 'success',
                    title: '刪除貼文',
                    content: res.data.message,
                    })
                    this.getArticles(this.currentPage);
                    this.$refs.delModal.hideModal();
                }).catch((err) => {
                    this.isLoading = false;
                    this.pushMessage({
                    style: 'danger',
                    title: '刪除貼文',
                    content: err.response.data.message,
                    })
                })
        },
    },
    created() {
        this.getArticles();
    },
}

</script>