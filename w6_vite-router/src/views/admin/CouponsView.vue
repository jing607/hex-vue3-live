<template>
    <div>
      <VueLoading :active="isLoading" :z-index="1060" />
      <div class="text-end mt-4">
        <button class="btn btn-primary" type="button" @click="openCouponModal(true)">
          建立新的優惠券
        </button>
      </div>
      <table class="table mt-4">
        <thead>
          <tr>
            <th>名稱</th>
            <th>折扣百分比</th>
            <th>到期日</th>
            <th>是否啟用</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in coupons" :key="key">
            <td>{{ item.title }}</td>
            <td>{{ item.percent }}%</td>
            <td>{{ $filters.date(item.due_date) }}</td>
            <td>
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else class="text-muted">未啟用</span>
            </td>
            <td>
              <div class="btn-group">
                <button type="button" class="btn btn-outline-primary btn-sm"
                    @click="openCouponModal(false, item)"
                   >編輯</button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="openDelCouponModal(item)">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
       
      <CouponModal ref="couponModal" :coupon="tempCoupon" :is-new="isNew" @update-coupon="updateCoupon" />
      <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon" />
    </div>
</template>


<script>
import { mapActions } from 'pinia'
import { useToastMessageStore } from "@/stores/toastMessage";
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env

import CouponModal from '@/components/admin/CouponModal.vue'
import DelModal from '@/components/DelModal.vue'

export default {
    components: {
      CouponModal,
      DelModal,
    },
    data() {
        return {
            coupons: {},
            tempCoupon: {
                title: '',
                is_enabled: 0,
                percent: 100,
                code: '',
            },
            isLoading: false,
            isNew: false,
        }
    },
    methods: {
      ...mapActions(useToastMessageStore, ['pushMessage']),
        getCoupons() {
            this.isLoading = true;
            const api = `${VITE_URL}/api/${VITE_PATH}/admin/coupons`;
            axios.get(api,)
                .then((res) => {
                    this.isLoading = false;
                    this.coupons = res.data.coupons;
                }).catch((err) => {
                    this.isLoading = false;
                    this.pushMessage({
                        style: 'success',
                        title: '取得優惠券',
                        content: err.response.data.message,
                    })
                });
        },
        openCouponModal(isNew, item) {
          this.isNew = isNew;
          if (this.isNew) {
            this.tempCoupon = {
              due_date: new Date().getTime() / 1000,
            };
          } else {
            this.tempCoupon = { ...item };
          }
          this.$refs.couponModal.openModal();
        },
        openDelCouponModal(item) {
          this.tempCoupon = { ...item };
          this.$refs.delModal.openModal();
        },
        updateCoupon(tempCoupon){
            this.isLoading = true;
            let api = `${VITE_URL}/api/${VITE_PATH}/admin/coupon`;
            let method = 'post';

            if (!this.isNew) {
              api = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
              method = 'put';
            }

            axios[method](api, { data: this.tempCoupon })
                .then((res) => {
                    this.isLoading = false;
                    this.pushMessage({
                        style: 'success',
                        title: '新增優惠券',
                        content: res.data.message,
                    })
                    this.getCoupons();
                    this.$refs.couponModal.hideModal();
                }).catch((err) => {
                    this.isLoading = false;
                    this.pushMessage({
                        style: 'danger',
                        title: '新增優惠券',
                        content: err.response.data.message,
                    })
                });
        },
        delCoupon() {
          this.isLoading = true;
          const api = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
          axios.delete(api)
            .then((res) => {
              this.isLoading = false;
              this.pushMessage({
                style: 'success',
                title: '刪除優惠券',
                content: res.data.message,
              });
              this.$refs.delModal.hideModal();
              this.getCoupons();
            }).catch((err) => {
              this.isLoading = false;
              this.pushMessage({
                style: 'danger',
                title: '刪除優惠券',
                content: err.response.data.message,
              });
            })
        },
    },
    created() {
        this.getCoupons();
    },
};


</script>