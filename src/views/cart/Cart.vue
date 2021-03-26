<template>
  <div class="cart">
<!--  导航  -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车（{{cartLength}}）</div>
    </nav-bar>
<!--  商品列表  -->
    <cart-list class="cart-list" :product="cartList"/>
<!--  底部汇总  -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar"

import CartList from "./childComps/CartList"
import CartBottomBar from "./childComps/CartBottomBar";

import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      // cartLength() {
      //   return this.$store.getters.cartLength
      // }
      // 两种语法 1. 指定（数组语法）
      ...mapGetters([ 'cartLength', 'cartList' ])
      // 对象语法
      // ...mapGetters({
      //   length: 'cartLength',
      //   list: 'cartList'
      // })
    }
  }
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: white;
}

.cart {
  /*position: relative;*/
  height: 100vh;
}

.cart-list {
  position: absolute;
  top: 44px;
  bottom: 49px;
  width: 100%;
}
</style>
