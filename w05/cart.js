const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const {createApp}=Vue;

const productModal={
    //id變動抓遠端
    props:['id','addToCart','openModal'],
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io',
            apiPath: 'harper',
            modal:{},
            tempProduct:{},
            qty:1,
        }
    },
    template: '#userProductModal',
    watch:{
        id(){
            console.log('內層傳入:', this.id); 
            if(this.id){   
            axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/product/${this.id}`)
            .then(res=>{
                this.tempProduct=res.data.product;
                // console.log('抓到了：',this.tempProduct);
                this.modal.show();
            });
        }
        }
    },
    methods:{
        hide(){
            this.modal.hide();    
        },
    },
    mounted(){
        //this.modal=new bootstrap.Modal('#userProductModal');
        this.modal=new bootstrap.Modal(this.$refs.modal);
        //清除id，不然無法開cart重覆
        this.$refs.modal.addEventListener('hidden.bs.modal', function (event) {
            // this.$emit('emptyCartId',''); 
            console.log("關掉modal");
           this.openModal('');
        });
        
    }
}

import ProductList from "./components/ProductList.js";
import CartList from "./components/CartList.js";


const app = createApp({
	data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io',
            apiPath: 'harper',
            products:[],
            productId:'',
            cart:{},
            loadingItem:'', //存id
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
            },
        }
	},
    methods:{
        getProducts(){
            axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/products/all`)
            .then(res=>{
                console.log ("產品列表:", res.data.products);
                this.products=res.data.products;
            });
        },
        openModal(id){
            this.productId=id;
            console.log("你點到的id: ", this.productId);
        },
        addToCart(product_id, qty=1){
            let data={
                // 同名不寫2次
                // product_id: product_id,
                // qty:qty
                product_id,
                qty,
            }
            axios.post(`${this.apiUrl}/v2/api/${this.apiPath}/cart`,{data})
            .then(res=>{
                console.log('加入購物車:',res.data);
                this.$refs.productModal.hide();
                this.getCart();
            });
        },
        getCart(){
            axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/cart`)
            .then(res=>{
                console.log('取得購物車:',res.data.data);
                this.cart=res.data.data
            });
        },
        modifyCart(item){
            //要送入購物車的id和產品id，送入的一包item裡，就會包函product資料
            let data={
                product_id: item.product.id,
                qty:item.qty,
            }
            this.loadingItem=item.id;
            axios.put(`${this.apiUrl}/v2/api/${this.apiPath}/cart/${item.id}`,{data})
            .then(res=>{
                console.log('更新購物車:',res.data);
                this.getCart();
                this.loadingItem='';
            });
        },
        deleteItem(item){
            this.loadingItem=item.id;
            axios.delete(`${this.apiUrl}/v2/api/${this.apiPath}/cart/${item.id}`)
            .then(res=>{
                console.log('刪除購物車:',res.data);
                this.getCart();
                this.loadingItem='';
            });
        },
        deleteAllCarts() {
            const url = `${this.apiUrl}/v2/api/${this.apiPath}/carts`;
            axios.delete(url).then((response) => {
              alert(response.data.message);
              this.getCart();
            }).catch((err) => {
              alert(err.response.data.message);
            });
          },
        createOrder() {
            const url = `${this.apiUrl}/v2/api/${this.apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then((response) => {
              alert(response.data.message);
              this.$refs.form.resetForm();
              this.getCart();
            }).catch((err) => {
              alert(err.response.data.message);
            });
          },
    },
    mounted(){
        this.getProducts();
        this.getCart();
        
    },
    components:{
        ProductList,
        productModal,
        CartList,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    }
});
app.mount('#app');
