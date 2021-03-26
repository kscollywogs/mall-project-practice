<template>
<!--  <div class="cart-list">-->
    <scroll ref="scroll" class="content">
      <div>
        <cart-list v-for="(item, index) in cartList"
                   :product="item"
                   :key="index" />
      </div>
    </scroll>
<!--  </div>-->
</template>

<script>
import Scroll from "components/common/scroll/Scroll"

import CartListItem from "./CartListItem"

import {mapGetters} from 'vuex'

export default {
  name: "CartList",
  components:{
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList', 'cartLength'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 49px - 84px);
}

.content {
  /*height: 100%;*/
  overflow: hidden;
}
</style>
