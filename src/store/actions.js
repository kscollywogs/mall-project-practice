import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

export default {
  addCart(context, payload) {

    return new Promise((resolve, reject) => {
      // 查找之前数组中是否有商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 判断oldProduct是否有值
      if (oldProduct) {
        // oldProduct.count += 1 当前商品数量加1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('商品数量加一')
      } else {
        // 添加新的商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, oldProduct)
        resolve('添加新的商品')
      }
    })
  }
}
