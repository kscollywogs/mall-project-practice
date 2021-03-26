<template>
<div class="bottom-bar">
  <div class="check-content">
    <CheckButton class="check-button"
                 @click.native="selectClick"
                 :isChecked="isSelectAll"/>
    <span>全选</span>
  </div>
  <div class="price">
    合计：{{totalPrice}}
  </div>
  <div class="calculate" @click="calcClick">
    去结算 ( {{checkLength}} )
  </div>
</div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton"

import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        // return this.cartList
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      // 查找不被选中的（长度）使用filter
      // return !(this.cartList.filter(item => item.checked).length)

      // 查找只要有一个不被选中的，就取反（false） 使用find
      if (this.cartList.length === 0) return false
      return !this.cartList.find(item => item.checked)

      // 遍历
      // let isChecked = false
      // for (let item of this.cartList) {
      //   if (!item.checked) {
      //     // isChecked = false
      //     return false
      //   }
      // }
      // return true
    }
  },
  methods: {
    selectClick() {
      // 全部选中
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false)
      // 全部不选中
      } else {
        this.cartList.forEach(item => item.checked = true)
      }
      // 遍历会影响 checked和isSelectAll冲突
      // this.cartList.forEach(item => item.checked = !this.isSelectAll)
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品')
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  background-color: #eee;
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 49px;
  display: flex;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
}

.check-content {
  width: 25%;
  display: flex;
  justify-content: center;
}

.check-button {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-top: 2px;
}

.price {
  /*margin-left: 20px;*/
  width: 50%;
}

.calculate {
  width: 30%;
  background-color: #ec4646;
  color:#fff;
  text-align: center;
}
</style>
