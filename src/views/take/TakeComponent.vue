<template>
  <div id="take">
    <nav-bar-component>
      <div slot="left">
          <h3>起点</h3>
        </div>
        <div slot="center">
          <search-suggest-component/>
        </div>
        <div slot="right">
          <el-button type="text" @click="addStartBtn">查询</el-button>
        </div>
    </nav-bar-component>

    <nav-bar-component>
      <div slot="left">
        <h3>终点</h3>
        </div>
        <div slot="center">
          <search-suggest-component/>
        </div>
        <div slot="right">
          <el-button type="text" @click="addEndBtn">路线</el-button>
        </div>
    </nav-bar-component>
    
    <div id="take-map-container">
      <map-component ref="childMap"/>
    </div>

  </div>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import SearchSuggestComponent from '@/components/searchSuggest/SearchSuggestComponent.vue';
import store from '@/store';

  export default {
    name: "TakeComponent",
    mixins:[checkIsLogin],
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      this.checkLogin(this)
    },
    mounted(){
      this.$message({showClose: true, message: "请依次输入起点和终点并点击右边按钮", type: 'info', offset: '60', duration: 0})
    },
    data() {
      return {
      }
    },
    components: {
      NavBarComponent,
      MapComponent,
      SearchSuggestComponent
    },
    methods: {
      /**
       * 添加起点到地图上
       */
      addStartBtn(){
        store.commit('setStartPosition',store.state.HomePosition)
        this.$refs.childMap.map.setZoomAndCenter(18, store.state.HomePosition)
      },


      /**
       * 添加终点到地图上
       */
      addEndBtn(){
        const vm = this
        if (store.state.StartPosition.length === 0){
          vm.$message({showClose: true, message: "请先输入起点并点击选择", type: 'error', offset: '60'})
          return;
        }
        store.commit('setEndPosition',store.state.HomePosition)
        const aMap = vm.$refs.childMap.aMap
        const map = vm.$refs.childMap.map
        //绘制路线
        aMap.plugin("AMap.DragRoute", function () {
          //path 是驾车导航的起、途径和终点，最多支持16个途经点
          let path = [];
          path.push(store.state.StartPosition);
          path.push(store.state.EndPosition);
          const route = new aMap.DragRoute(map, path, 0);
          route.search();
        });
      },

    }

  }
</script>

<style scoped>
#take-map-container{
  position: relative;
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 840px;
}

</style>