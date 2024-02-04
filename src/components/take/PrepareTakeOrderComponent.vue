<template>
  <div id="prepare-take-order">
    <el-descriptions title="下单信息" :column="2" size="mini" border>
      <el-descriptions-item label="起点">{{start}}</el-descriptions-item>
      <el-descriptions-item label="终点">{{end}}</el-descriptions-item>
      <el-descriptions-item label="预估距离">{{distance / 1000}}km</el-descriptions-item>
      <el-descriptions-item label="预估价格">{{price}}元</el-descriptions-item>
      <el-descriptions-item label="预计到达时间">{{arriveTimeStr}}</el-descriptions-item>
      <template slot="extra">
        <el-button size="medium" @click="takeOrder" round :style="createOrderSuccessPreDisplay" >
          下单
        </el-button>
        <el-button size="medium" @click="cancel" round :style="createOrderSuccessPreDisplay">
          取消
        </el-button>
        <el-button size="medium" @click="cancelOrder" round :style="createOrderSuccessDisplay">
          取消订单
        </el-button>
      </template>
    </el-descriptions>
    <div :style="createOrderSuccessDisplay">
      正在等待司机接单..., 剩余时间:{{countdown}}秒
    </div>
  </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import { requestGateway } from '@/network/request';
import store from '@/store';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export default {
  name: "PrepareTakeOrderComponent",
  props: [
    'start', 'end', 'distance', 'arriveTime'
  ],
  data() {
    return {
      createOrderSuccessPreDisplay: {display: ''},
      createOrderSuccessDisplay: {display: 'none'},
      timeOut: 0,
      countdown: 300,
      stompClient: null,
      message: '',
    }
  },
  methods: {
    /**
     * 提交订单
     */
    takeOrder() {
      this.$emit('take-order-event');
    },

 
    /**
     * 取消预备订单，也就是没有提交到服务端的订单
     */
    cancel() {
      //给父组件通信，清空所有相关信息
      this.$emit('cancel-event')
    },


    handleCreateOrderSuccess() {
      const vm = this
      //1.修改页面信息，展示正在寻找司机
      vm.createOrderSuccessPreDisplay = {display: 'none'}
      vm.createOrderSuccessDisplay = {display: ''}
      //2.websocket订阅是否有司机接单
      vm.connect();
      //3.显示倒计时5分钟，倒计时结束后自动请求后端查询订单状态，根据信息取消订单，并告知用户没有司机接单
      vm.timeOut = setInterval(() => {
        if (vm.countdown > 0)
          vm.countdown--;
        else {
          //自动取消订单
          vm.$message({showClose: true, message: "等待超时,请重新尝试", type: 'error', offset: '60'});
          vm.cancelOrder();
        }
      }, 1000);

    },


    connect() {
      const vm = this
      const socket = new SockJS('/websocket/ws');
      vm.stompClient = Stomp.over(socket);
      vm.stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);
        //订阅司机接单消息
        const userId = store.state.User.id;
        vm.stompClient.subscribe(`/user/${userId}/queue/notifications`, notification => {
          vm.message = JSON.parse(notification.body).content;
          //改变仓库数据
          store.commit('setUserCreateOrderVoWithNotNull', {"driverId": vm.message.driverId, "status": 1})
          store.commit('setAcceptPosition', [vm.message.nowAddressLongitude, vm.message.nowAddressLatitude])
          console.log(store.state.UserCreateOrderVo);
          console.log(store.state.AcceptPosition);

          //改变页面展示

          console.log('this.message :>> ', vm.message);
        });

      }, error => {
        console.error('Error connecting to WebSocket:', error);
      });
    },


    disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
      }
      console.log("Disconnected");
    },


    cancelOrder() {
      const vm = this;
      //1.发送取消请求，提示取消结果
      //2.取消成功关闭websocket连接，解除倒计时，改变页面。取消失败继续进行订单
      const order = {
        "userId": store.state.UserCreateOrderVo.userId,
        "startAddress": store.state.UserCreateOrderVo.startAddress,
        "endAddress": store.state.UserCreateOrderVo.endAddress,
        "distance": store.state.UserCreateOrderVo.distance,
        "status": store.state.UserCreateOrderVo.status,
      }
      requestGateway({
        url: '/api/main/cancelOrder',
        method: 'post',
        data: order
      }).then(res => {
        //判断取消结果
        if(res.data === Error_Msg.ORDER_CANCEL_SUCCESS){
          vm.$message({showClose: true, message: Error_Msg.ORDER_CANCEL_SUCCESS, type: 'success', offset: '60', duration: 0});
          clearInterval(vm.timeOut)
          this.disconnect();
          //数据改变
          vm.countdown = 300;

          //页面改变
          vm.createOrderSuccessPreDisplay = {display: ''}
          vm.createOrderSuccessDisplay = {display: 'none'}
          
        }else if(res.data === Error_Msg.ORDER_CANCEL_ERROR) {
          vm.$message({showClose: true, message: Error_Msg.ORDER_CANCEL_ERROR, type: 'error', offset: '60'});
        }
      }).catch(err => {
        console.log('err :>> ', err);
      });

    }

  },
  computed: {
    /**
     * 预估价格计算属性
     * 三公里内8元起步价，三公里以上每公里收2.4元
     */
    price() {
      const km = this.distance / 1000
      if (km <= 3) return 8;
      //保留两位小数
      return Math.round( (8 + (km-3)*2.4)*100 ) / 100;
    },


    /**
     * 预计到达时间计算属性
     */
    arriveTimeStr() {
      const second = this.arriveTime
      const hour = Math.floor(second / 3600)
      //分钟默认去尾+1
      const minute = Math.floor(second / 60 % 60 + 1)
      return hour >= 1 ? hour+'小时'+minute+'分钟' : minute+'分钟';
    }

  },
  beforeDestroy() {
    this.disconnect();
  }
}
</script>

<style scoped>
#prepare-take-order{
  background-color:lavender;
  position: absolute;
  width: 100%;
  top: 14%;
  z-index: 2;
}
</style>