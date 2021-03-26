<template>
<!--  ref绑定给子组件 通过ref获取 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import PullUp from '@better-scroll/pull-up'

BScroll.use(PullUp)

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType ===3) {
        this.scroll.on('scroll', (position) => {
          this.$emit('scroll', position)
        })
      }

      // 3.监听scroll滚动到底部/上拉事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
      /**
       * 等图片加载完成后调用refresh(解决better scroll滚动区域问题)
       * better-scroll决定有多少区域可滚动时
       * 是根据scrollerHeight属性决定
       * scrollerHeight属性是根据放BS的
       * content中的子组件的高度
       * 但是首页中刚开始计算scrollerHeight属性时
       * 是没有将图片计算在内，所以是错误的
       * 后来图片懒加载出来有了新高度
       * scrollerHeight属性没有更新
       * 解决：监听每一张图片加载完成，每张加载完refresh
       */
      // this.scroll.refresh()
    },
    methods: {
      scrollTo(x, y, time=300) {
        // 判断有无值
        this.scroll && this.scroll.scrollTo(x, y, time)
        // this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
        // this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
