// 使用esm的方法加入vue的createApp
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'harper',
      products: [],
      temP: {},
    }
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = '../w02portal.html';
        })
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((response) => {
            console.log(response.data.products);
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    openProduct(item) {
      this.temP = item;
    },
    deleteProduct(item_id){
        axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${item_id}`)
        // 有成功都會放在data裡，所以抓下一層
        .then((res)=>{
            console.log(res.data);
            this.getData();
        })
        .catch((err)=>{
        // 用dir可以debug
        console.dir(err);
        })
    }
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    // axios.defaults.headers.common['Authorization'] = token;
    console.log("token:", token);
    this.checkAdmin()
  }
}).mount('#app');