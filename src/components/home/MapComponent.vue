<template>
  <div id="container">
  </div>
</template>

<script >
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: "MapComponent",
  props:['address'],
  data() {
    return {
      map:null ,//初始化
    }
  },
  mounted() {
    this.initAMap();
  },
  unmounted() {
    this.map?.destroy();
  },
  methods: {
    //初始化地图
    initAMap() {
      AMapLoader.load({ 
        key: "64920b361d05ba95dd58da13746fc6ac", //开发者Key:首次调用load必须写
        version: "2.0", 
        plugins: [
          "AMap.Scale"
        ], // 需要使用的的插件列表
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            viewMode: "3D", 
            zoom: 12,
            resizeEnable: true
          });
          let scale = new AMap.Scale();   //比例尺
          this.map.addControl(scale);
        })
        .catch((e) => {
          console.log('err' + e);
        });
    },
    //搜索到达对应地点
    searchAddress() {
      AMapLoader.load({ 
        key: "a1c90f5c7a1d0d6c74589955e4303b0c",
        version: 2.0,
        plugins: ["AMap.Geocoder"] // 需要使用的的插件列表
      })
        .then((AMap) => {
          alert("pre")
          var geocoder = new AMap.Geocoder({city: "010"});
          
          geocoder.getLocation('北京市朝阳区阜荣街10号', function(status, result){
            alert("behind")
            if (status === 'complete'&&result.geocodes.length) {
              var lnglat = result.geocodes[0].location
              alert(lnglat)
            }else{
              console.error('根据地址查询位置失败');
            }
          })

        })
        .catch((e) => {
          console.log('err' + e);
        });
    }
  },
  watch: {
    address(){
      alert("watch")
      this.searchAddress()
    }
  }

}
</script>

<style scoped>
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 800px;
  }
</style>