<template>
<div id="detail">
  <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
  <scroll class="content"
          ref="scroll"
          :probe-type="3"
          @scroll="contentScroll">
    <detail-swiper :top-images="topImages" />
    <detail-base-info :goods="goods" />
    <detail-shop-info :shop="shop" />
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
    <detail-param-info :param-info="paramInfo" ref="params"/>
    <detail-comment-info :comment-info="commentInfo" ref="comment"/>
    <goods-list :goods="recommend" ref="recommend"/>
  </scroll>
  <detail-bottom-bar @addCart="addCart" class="bottom"/>
  <back-top @click.native="backTop" v-show="isShowBackTop"/>
</div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";
import GoodsList from "@/components/content/goods/GoodsList";
// import Toast from "@/components/common/toast/Toast";

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "network/detail";
import { itemListenerMix } from "common/mixin";
import { debounce } from "common/utils";
import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
    BackTop,
    // Toast
  },
  mixin: [itemListenerMix],
  data() {
    return{
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo:{},
      commentInfo: {},
      recommend: [],
      currentIndex: 0,
      themeTops: [],
      getThemeTopY: null,
      isShowBackTop: false,
      // message: '',
      // show: false
    }
  },
  created() {
    // 1. 保存传入的iid
    this.iid = this.$route.params.iid
    this.getDetail()
    this.getRecommend()
    // 给getThemeTopY赋值(对给this.themeTops赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themeTops = []
      this.themeTops.push(0)
      this.themeTops.push(this.$refs.params.$el.offsetTop)
      this.themeTops.push(this.$refs.comment.$el.offsetTop)
      this.themeTops.push(this.$refs.recommend.$el.offsetTop)
    }, 100)
  },
  methods: {
    // 映射函数
    // ...mapActions(['addCart']),

    // 2. 根据iid请求详情数据
    getDetail() {
      getDetail(this.iid).then(res => {
        // 获取结果（中转）
        const data = res.result;
        // 1. 获取顶部图片轮播数据
        this.topImages = data.itemInfo.topImages
        // 2. 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 3. 创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)
        // 4. 直接保存商品详情数据
        this.detailInfo = data.detailInfo
        // 5. 商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 6.保存评论信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
        // 等待前面都渲染完 这里回调
        // this.$nextTick(() => {
        // 根据最新的数据，对应的DOM是已经被渲染出来了，但是图片还没有
        // 此时的offsetTop是不包含图片的
        // this.themeTops = []
        // this.themeTops.push(0)
        // this.themeTops.push(this.$refs.params.$el.offsetTop)
        // this.themeTops.push(this.$refs.comment.$el.offsetTop)
        // this.themeTops.push(this.$refs.recommend.$el.offsetTop)
        // })
      })
    },
    getRecommend() {
      getRecommend().then((res, error) => {
        if (error) return
        this.recommend = res.data.list
      })
      // 监听滚动取值
      // this.getThemeTopY = debounce(() => {
      //   this.themeTops = []
      //   this.themeTops.push(0)
      //   this.themeTops.push(this.$refs.params.$el.offsetTop)
      //   this.themeTops.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      //   this.themeTops.push(Number.MAX_VALUE)
      // }, 100)
    },
    imageLoad() {
      // this.$refs.scroll.refresh()
      this.newRefresh()

      this.getThemeTopY()
    },
    titleClick() {
      this.$refs.scroll.scrollTo(0, this.themeTops[index], 200)
    },
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y
      // positionY和主题中的值对比
      // 这里的i类型是String 需要转换
      // for (let i in this.themeTops) {
      //   if (positionY > this.themeTops[parseInt(i)] && positionY < this.themeTops[i+1]) {
      //   }
      // }
      let length = this.themeTops.length
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex >= this.themeTops[i] && positionY < this.themeTops[i + 1]) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      this.isShowBackTop = (-position.y) > 1000
    },
    /**  if (this.currentIndex !== i && ((i < length -1 && positionY >= this.themeTops[i] && positionY < this.themeTops[i+1])
     *   || (i ===length -1 && positionY >= this.themeTops[i]))) {
     *   this.currentIndex = i
     *   this.$refs.nav.currentIndex = this.currentIndex
     *   }
     */
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    addCart() {
      // 1. 获取购物车要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goodsInfo.title
      product.desc = this.goodsInfo.desc
      product.price = this.goodsInfo.newPrice
      product.iid = this.iid
      // 2. 将商品添加到购物车
      // this.$store.commit('addCart', product)
      // this.$store.cartList.push(product)

      // 把action中的方法映射到组件中
      // this.addCart(product).then(res => {
      //
      // })
      this.$store.dispatch('addCart', product).then(res => {
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)
        this.$toast.show(res, 1500)
      })
    }
  },
  mounted() {
  },
  updated() {
    // 先清空
    // this.themeTops = []
    // this.themeTops.push(0)
    // this.themeTops.push(this.$refs.params.$el.offsetTop)
    // this.themeTops.push(this.$refs.comment.$el.offsetTop)
    // this.themeTops.push(this.$refs.recommend.$el.offsetTop)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 999;
  background-color: #ffffff;
  height: 100vh
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #ffffff;
}

.content {
  /*让内容覆盖tabbar*/
  /*background-color: #fff;*/
  height: calc(100% - 44px);
}

.bottom {
  margin-bottom: 1px;
}
</style>
