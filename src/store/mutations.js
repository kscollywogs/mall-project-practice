import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

export default {
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    payload.count = 1
    state.cartList.push(payload)
  }
}

// mutations目的是修改state中的状态
// 每个方法尽可能只完成的事情一件事情
// addCart(state, payload) {
// payload新添加的商品
// let oldProduct = null
// for (let item of state.cartList) {
//   if (item.iid === payload.iid) {
//     oldProduct = item
//   }
// }
