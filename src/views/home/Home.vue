<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" />
      <recommend-view :recommends="recommends" />
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2" />
      <good-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick"
              v-show="isShowBackTop" />
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import { getHomeMultidata, getHomeGoods } from "network/home"
  import { itemListenerMix } from "common/mixin";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll,
      BackTop
    },
    mixin: [itemListenerMix],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    // 钩子函数
    activated() {
      // 让home内容保持在原本位置
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      // 取消全局事件的监听
      // this.$bus.$off('itemImageLoad')
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      // 图片加载完成后的事件监听
      // const refresh = debounce(this.$refs.scroll.refresh, 50)
      // 监听itemImageLoad
      // this.$bus.$on('itemImageLoad', () => {
        // this.$refs.scroll.refresh()
        // refresh()
      // })
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
        // 1.判断backTop是否显示
        this.isShowBackTop = (-position.y) > 1000
        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        // 加载此时正在记录的type
        this.getHomeGoods(this.currentType)
      },
      // 获取tabControl的offsetTop
      // 所有组件都有一个属性$el 获取组件中的元素
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // 获取到res
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // 调用后才能继续加载loadMore（完成上拉加载更多）
          this.$refs.scroll.finishPullUp()
        })
      },
    }
  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px;
     * vh - viewport height视口高度
     **/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.tab-control {*/
    /*position: sticky;*/
    /*top: 44px;*/
    /*z-index: 9;*/
  /*}*/

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 0;
  }
  /*.content {
   * height: calc(100% - 93px);
   * overflow: hidden;
   * margin-top: 44px;
   * }
   **/
</style>
