<template>
  <h2>Order list</h2>
  <VueLoading :active="isLoading" :z-index="1060" />
	<table class="table mt-4">
		<thead>
			<tr>
				<th>購買時間</th>
				<th>Email</th>
				<th>購買款項</th>
				<th>應付金額</th>
				<th>是否付款</th>
				<th>編輯</th>
			</tr>
		</thead>
		<tbody>
			<template v-for="item in orders" :key="item.id">
				<!-- vif 若有訂單時才渲染。:class是有支付的情況下才會套入樣式 -->
				<tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
					<!-- 引用filters.js中的date對日期進行格式化 -->
					<td>{{ $filters.date(item.create_at) }}</td>
					<td><span v-text="item.user.email" v-if="item.user"></span></td>
					<td>
						<ul class="list-unstyled">
							<li v-for="product in item.products" :key="product.id">
								{{ product.product.title }} 數量：{{ product.qty}}
								{{ product.product.unit }}
							</li>
						</ul>
					</td>
					<td class="text-right">{{ item.total }}</td>
					<td>
						<div class="form-check form-switch">
							<input
								class="form-check-input"
								type="checkbox"
								:id="`paidSwitch${item.id}`"
								v-model="item.is_paid"
								@change="updatePaid(item)"
							/>
							<label class="form-check-label" :for="`paidSwitch${item.id}`">
								<span v-if="item.is_paid">已付款</span>
								<span v-else>未付款</span>
							</label>
						</div>
					</td>
					<td>
						<div class="btn-group">
							<button
								class="btn btn-outline-primary btn-sm"
								type="button"
								@click="openModal(item)"
							>
								檢視
							</button>
							<button
								class="btn btn-outline-danger btn-sm"
								type="button"
								@click="openDelOrderModal(item)"
							>
								刪除
							</button>
						</div>
					</td>
				</tr>
			</template>
		</tbody>
	</table>

	<OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid" />
	<PaginationComponent :pages="pagination" @emit-pages="getOrders"/>
	<DelModal :item="tempOrder" ref="delModal" @del-item="delOrder" />
	
  </template>
  
<script>
import { mapActions } from 'pinia'
import { useToastMessageStore } from "@/stores/toastMessage";
import axios from 'axios';
const {VITE_URL, VITE_PATH} = import.meta.env

import DelModal from '@/components/DelModal.vue'
import PaginationComponent from '@/components/PaginationComponent.vue';
import OrderModal from '@/components/admin/OrderModal.vue'

export default {
	data() {
		return {
			orders: {},
			isNew: false,
			pagination: {},
			isLoading: false,
			tempOrder: {},
			currentPage: 1,
		};
	},
	components: {
		OrderModal,
		PaginationComponent,
		DelModal,
	},
	methods: {
		...mapActions(useToastMessageStore, ['pushMessage']),
		getOrders(page = 1) {
			this.currentPage = page;
			this.isLoading = true;
			const api = `${VITE_URL}/api/${VITE_PATH}/admin/orders?page=${page}`;
			axios.get(api, this.tempProduct)
				.then((res) => {
					this.orders = res.data.orders;
					this.pagination = res.data.pagination;
					this.isLoading = false;
				}).catch((error) => {
					this.isLoading = false;
					this.pushMessage({
					style: 'danger',
					title: '錯誤訊息',
					content: error.response.data.message,
					})
				});
				
		},
		openModal(item) {
			this.tempOrder = { ...item };
			this.isNew = false;
			const orderComponent = this.$refs.orderModal;
			orderComponent.openModal();
			console.log(this.tempOrder);
		},
		openDelOrderModal(item) {
			this.tempOrder = { ...item };
			this.$refs.delModal.openModal();
		},
		// 是否付款按鈕：
		updatePaid(item) {
			this.isLoading = true;
			const api = `${VITE_URL}/api/${VITE_PATH}/admin/order/${item.id}`
			const paid = {
				is_paid: item.is_paid,
			};
			axios.put(api, { data: paid })
				.then((res) => {
					this.isLoading = false;
					this.$refs.orderModal.hideModal();
					this.pushMessage({
						style: 'success',
						title: '更新付款狀態',
						content: res.data.message,
					});
					this.getOrders(this.currentPage);
				}).catch((err) => {
					this.isLoading = false;

					this.pushMessage({
					style: 'danger',
					title: '錯誤訊息',
					content: err.response.data.message,
				})
			});
		},
		delOrder() {
			this.isLoading = true;
			const api = `${VITE_URL}/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`;
			axios.delete(api)
				.then((res) => {
					this.isLoading = false;
					this.$refs.delModal.hideModal();
					this.pushMessage({
						style: 'success',
						title: '已刪除',
						content: res.data.message,
					});
					this.getOrders(this.currentPage);
				}).catch((err) => {
					this.isLoading = false;
					this.pushMessage({
						style: 'dager',
						title: '錯誤訊息',
						content: error.response.data.message,
					});
				})
		},
	},
	created() {
		this.getOrders();
	},
	// mounted() {
	// 	this.$refs.orderModal.openModal()
	// }
}

</script>

<style>
</style>
