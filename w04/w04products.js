import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';


let productModal = null;
let delProductModal = null;

const app=createApp({
    mounted(){
        this.getMyPath();

        //載入model
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        // axios.defaults.headers.common['Authorization'] = token;
        //console.log("token:", token);
        this.checkAdmin()
    },
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: '',
            products: [],
            isNew:false,
            target:{},
            page:{}, 
        }
    },
    methods : {
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.target.id}`;
            axios.delete(url).then((response) => {
                alert(response.data.message);
                delProductModal.hide();
                this.getData();
            }).catch((err) => {
                alert(err.response.data.message);
            })
        },
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.target.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.target }).then((response) => {
                alert(response.data.message);
                productModal.hide();
                this.getData();
            }).catch((err) => {
                alert(err.response.data.message);
            })
        },
        createImages() {
            this.target.imagesUrl = [];
            this.target.imagesUrl.push('');
        },
        callModal(action, item){

            switch(action){
                case "new":
                    this.target = {
                        imagesUrl: [],
                    };
                    this.isNew=true;
                    productModal.show();
                    break;
                case "edit":
                    this.isNew=false;
                    this.target={...item};
                    productModal.show();
                    break;
                case "delete":
                    this.target={...item};
                    delProductModal.show();
                    break;
                default:
                    //catch error
            }
        },
        getMyPath(){
            let getUrlString = location.href;
            let url = new URL(getUrlString);
            this.apiPath=url.searchParams.get('apipath');
            // console.log(this.apiPath);
        },
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
            .then(() => {
                this.getData();
            })
            .catch((err) => {
                alert(err.response.data.message)
                window.location = './w03portal.html';
            })
        },
        getData(page=1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
            .then((response) => {
                console.log(response.data.products);
                this.products = response.data.products;
                this.page=response.data.pagination;
            })
            .catch((err) => {
                console.dir(err);
                alert(err.data.message);
            })
        },
    },
    components:{
        pagination
    }

});

app.component('product-modal',{
    props:['target','updateProduct'],
    template:'#product-modal-template',
});
app.component('delete-modal',{
    props:['target','delProduct'],
    template:'#delete-modal-template',
});

app.mount('#app');