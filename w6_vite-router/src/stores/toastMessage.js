import { defineStore } from 'pinia';

export const useToastMessageStore = defineStore('toastMessage', {
  state: () => {
    return {
      messages: [], // 用於儲存 toast message
    };
  },
  actions: {
    toastShow() {
      setTimeout(() => { // 3秒移除第一個訊息陣列值
        this.messages.shift(); 
      },3000);
    },
    clearToast(index) { // 關閉 toast 的 button
      this.messages.splice(index, 1); // 移除指定index的訊息
    },
    pushMessage(message) {
      const { style = 'success', title, content } = message;
      this.messages.push({ style, title, content });
      this.toastShow();
    }
  },
});
