import Toast from './Toast'

const toast = {}

toast.install = function (Vue) {
  // 一般情况下需要创建组件构造器
  // Vue.extend(Toast)
  // document.body.appendChild(Toast.$el)

  // 1.创建组件构造器
  const toastConstructor = Vue.extend(Toast)
  // 2.通过new的方式根据组件构造器 可以创建出来一个组件对象
  const toast = new toastConstructor()
  // 3.将组件对象手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  // 4.toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = Toast
}

export default toast
