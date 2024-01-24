<template>
  <div id="container">
    
  </div>
</template>

<script type="text/javascript">
window._AMapSecurityConfig = {
  securityJsCode: "b96e81c0ef8264f5345a7da790828a5a"
};
import AMapLoader from '@amap/amap-jsapi-loader'; //导入默认的不加外面括号
import { requestMapSearch } from '../../network/request';

export default {
  name: "MapComponent",
  props:['address'],//父组件传来的要搜索的地址
  data() {
    return {
      map: null ,//初始化地图对象
      auto: [],  //输入提示
      nowAddress:{//当前地址信息
        text:'',
        Longitude:0,
        Latitude:0
      }
    }
  },
  mounted() {
    this.initAMap();
  },
  unmounted() {
    this.map?.destroy();
  },
  methods: {
    /**
     * 初始化地图
     */
    initAMap() {
      AMapLoader.load({ 
        key: "64920b361d05ba95dd58da13746fc6ac", //开发者Key:首次调用load必须写
        version: "2.0", 
        plugins: [
          "AMap.Scale","AMap.ToolBar"
        ], // 需要使用的的插件列表
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            viewMode: "2D", 
            zoom: 14,
            resizeEnable: true
          });
          this.map.addControl(new AMap.Scale());//比例尺
          this.map.addControl(new AMap.ToolBar())//放大缩小
        })
        .catch((e) => {
          console.log('err' + e);
        });
    },
    /**
     * 搜索并定位到指定的地址
     */
    searchAddress(){
      let vm = this
      //请求搜索该地点的经纬度
      requestMapSearch({
        searchAddress: vm.address
      })
      .then(function(res) {
        let location = res.data.geocodes[0].location + ''
        location = location.split(',')
        vm.nowAddress = {
          text: vm.address,
          Longitude:location[0],
          Latitude: location[1]
        }
        //设置中心点
        let position = [ location[0] , location[1] ]
        vm.map.setZoomAndCenter(18,position)
      })
      .catch(function(err) {
        vm.$message({showClose: true,message: err,type: 'error',offset: '60'})
      });
    }

  },
  watch: {
    /**
     * 检测传来要搜索的地址信息
     * @param {*} newValue 新值
     * @param {*} oldValue 旧值
     */
    address(newValue,oldValue){
      if (newValue === oldValue) 
        return;
      this.searchAddress()
    }
    
  }

}
</script>

<style scoped>
  #container{
    position: relative;
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 100%;
  }
</style>