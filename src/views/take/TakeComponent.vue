<template>
  <div id="take">
    <nav-bar-component>
      <div slot="left">
          <h3>起点</h3>
        </div>
        <div slot="center">
          <search-suggest-component ref="childStartSearch"/>
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
          <search-suggest-component ref="childEndSearch" :is-disabled="isDisabled"/>
        </div>
        <div slot="right">
          <el-button type="text" @click="addEndBtn" :disabled="isDisabled">路线</el-button>
        </div>
    </nav-bar-component>

    <prepare-take-order-component 
      v-show="showOrderMsg" @cancel-event="handleChildCancelEvent" 
      @take-order-event="handleChildTakeOrderEvent"
      :start="startAddress" :end="endAddress"
      :distance="distance" :arrive-time="arriveTime"
      ref="childPrepare"
    />

    <div id="take-map-container">
      <map-component ref="childMap"></map-component>
    </div>
  </div>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import SearchSuggestComponent from '@/components/searchSuggest/SearchSuggestComponent.vue';
import PrepareTakeOrderComponent from '@/components/take/PrepareTakeOrderComponent.vue';
import { requestGateway, requestMapSearch } from '@/network/request';
import store from '@/store';

  export default {
    name: "TakeComponent",
    mixins:[checkIsLogin],
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      this.checkLogin(this)
    },
    mounted(){
      this.$message({showClose: true, message: "请先输入起点并点击查询", type: 'info', offset: '60', duration: 0})
    },
    data() {
      return {
        isDisabled: true,
        startAddress: '',
        endAddress: '',
        distance: 0,
        arriveTime: 0,
        showOrderMsg: false,
        driving: null //AMap.Driving实例
      }
    },
    components: {
      NavBarComponent,
      MapComponent,
      SearchSuggestComponent,
      PrepareTakeOrderComponent
    },
    methods: {
      /**
       * 添加起点
       */
      addStartBtn(){
        this.startAddress = this.$refs.childStartSearch.searchSuggestInput
        if ( store.state.HomePosition.length === 0 ){
          if ( this.$refs.childStartSearch.searchSuggestInput === '' )
            this.$message({showClose: true, message: "起点输入为空", type: 'error', offset: '60'});
          else{
            //用户手敲的地址并没有选择提示框内的地址
            requestMapSearch({
              searchAddress: this.$refs.childStartSearch.searchSuggestInput
            }).then(res => {
              const list = ('' + res.data.geocodes[0].location).split(',')
              store.commit('setStartPosition', list)
              this.$refs.childMap.map.setZoomAndCenter(18, list)
              store.commit('setHomePosition', [])
              this.isDisabled = false
            }).catch(err => {
              console.log('err :>> ', err);
              this.$message({showClose: true, message: "起点地址查询失败，请稍后重试", type: 'error', offset: '60'});
            });
          }
          return;
        }
        store.commit('setStartPosition', store.state.HomePosition)
        this.$refs.childMap.map.setZoomAndCenter(18, store.state.HomePosition)
        store.commit('setHomePosition', [])
        this.isDisabled = false
      },


      /**
       * 添加终点, 并执行showPath
       */
      addEndBtn(){
        const vm = this
        vm.endAddress = vm.$refs.childEndSearch.searchSuggestInput

        if (store.state.StartPosition.length === 0){
          vm.$message({showClose: true, message: "请先输入起点并点击查询", type: 'error', offset: '60'})
          return;
        }

        if ( store.state.HomePosition.length === 0 ){
          if ( vm.$refs.childEndSearch.searchSuggestInput === '' )
            vm.$message({showClose: true, message: "终点输入为空", type: 'error', offset: '60'});
          else{
            //用户手敲的地址并没有选择提示框内的地址
            requestMapSearch({
              searchAddress: vm.$refs.childEndSearch.searchSuggestInput
            }).then(res => {
              const list = ('' + res.data.geocodes[0].location).split(',')
              store.commit('setEndPosition', list)
              store.commit('setHomePosition', [])
              vm.showPath()
            }).catch(err => {
              console.log('err :>> ', err);
              vm.$message({showClose: true, message: "终点地址查询失败，请稍后重试", type: 'error', offset: '60'});
            });
          }
          return;
        }
        
        store.commit('setEndPosition',store.state.HomePosition)
        store.commit('setHomePosition', [])
        vm.showPath()
      },


      /**
       * 绘制路线图展示
       */
      showPath() {
        const vm = this
        const aMap = vm.$refs.childMap.aMap
        const map = vm.$refs.childMap.map
        const city = store.state.City
        //绘制路线
        aMap.plugin("AMap.Driving", function () {
          //path 是驾车导航的起、途径和终点，最多支持16个途经点
          let path = [
          { 'keyword': vm.startAddress, 'city': city },
          { 'keyword': vm.endAddress, 'city': city }
          ];
          const driver = new aMap.Driving({
            policy: 0, 
            map: map,
          });
          //绘图
          driver.search(path);
          driver.on('complete', function(result) {
            if (result.info === 'OK') {
              const route = result.routes[0];
              vm.distance = route.distance;
              vm.arriveTime = route.time;
            }
          });
          vm.driving = driver
          //产生相关信息的界面
          vm.showOrderMsg = true
        });
      },


      /**
       * 取消待提交订单
       */
      handleChildCancelEvent() {
        //清空所有相关信息
        const vm = this
        vm.startAddress = ''
        vm.endAddress = ''
        vm.isDisabled = true
        vm.showOrderMsg = false
        store.commit('setStartPosition', [])
        store.commit('setEndPosition', [])
        vm.$refs.childStartSearch.searchSuggestInput = ''
        vm.$refs.childEndSearch.searchSuggestInput = ''
        vm.driving.clear()
      },


      /**
       * 提交订单到服务端
       */
      handleChildTakeOrderEvent() {
        const vm = this;
        //1.收集数据
        const userCreateOrderVo = {
          userId: store.state.User.id,
          startAddress: vm.startAddress,
          startAddressLongitude: store.state.StartPosition[0],
          startAddressLatitude: store.state.StartPosition[1],
          endAddress: vm.endAddress,
          endAddressLongitude: store.state.EndPosition[0],
          endAddressLatitude: store.state.EndPosition[1],
          distance: vm.distance / 1000,
        };
        //2.发送请求
        requestGateway({
          url: '/api/main/createOrder',
          method: 'post',
          data: userCreateOrderVo
        }).then(res => {
          if (res.data === Error_Msg.ORDER_CREATE_ERROR)
            vm.$message({showClose: true, message: Error_Msg.ORDER_CREATE_ERROR, type: 'error', offset: '60'})
          else if(res.data === Error_Msg.ORDER_NOT_SOLVED)
            vm.$message({showClose: true, message: Error_Msg.ORDER_NOT_SOLVED, type: 'error', offset: '60'})
          else {
            vm.$message({showClose: true, message: Error_Msg.ORDER_CREATE_SUCCESS, type: 'success', offset: '60'})
            //3.处理结果
            this.$refs.childPrepare.handleCreateOrderSuccess()
          }

        }).catch(err => {
          console.log('err :>> ', err);
          vm.$message({showClose: true, message: Error_Msg.ORDER_CREATE_ERROR, type: 'error', offset: '60'})
        })
      },

    }
  }
</script>

<style scoped>
#take-map-container{
  z-index: 1;
  position: relative;
  padding:0px;
  top: 0;
  width: 100%;
  height: 840px;
}
</style>