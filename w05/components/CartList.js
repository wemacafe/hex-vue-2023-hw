export default{
    props:['cart','modifyCart','deleteItem','loadingItem','deleteAllCarts'],
    template: `<div class="text-end">
    <button class="btn btn-outline-danger" type="button"
    @click="deleteAllCarts()"
    >清空購物車</button>
  </div>
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th>單價</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="cart.carts">
        <tr v-for="item in cart.carts" :key="item.id">
          <td>
            <button type="button" class="btn btn-outline-danger btn-sm"
            @click="deleteItem(item)"
            :disabled="item.id===loadingItem">
             
              x
            </button>
          </td>
          <td>
            {{ item.product.title }}
            
          </td>
          <td>
            <div class="input-group input-group-sm">
            <select name="" id="" class="form-select" v-model="item.qty"
            :disabled="item.id===loadingItem"
            @change="modifyCart(item)" 
            >
                <option :value="i" v-for="i in 20" :key="i+12345">{{i}}</option>
            </select>
            </div>
          </td>
          <td class="text-end">
            
            {{ item.total }}
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="text-end">總計</td>
        <td class="text-end">{{ cart.total }}</td>
      </tr>
      <tr>
        <td colspan="3" class="text-end text-success">折扣價</td>
        <td class="text-end text-success">{{ cart.final_total }}</td>
      </tr>
    </tfoot>
  </table>`
}