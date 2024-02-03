<template>
  <div id="prepare-take-order">
    <el-descriptions title="下单信息" column="2" size="mini" border>
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
      正在等待司机接单..., 剩余时间:300秒
    </div>
  </div>
</template>

<script>
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
      //1.修改页面信息，展示正在寻找司机
      this.createOrderSuccessPreDisplay = {display: 'none'}
      this.createOrderSuccessDisplay = {display: ''}

      //2.websocket订阅是否有司机接单
      this.connect();

      //3.显示倒计时5分钟，倒计时结束后自动请求后端查询订单状态，根据信息取消订单，并告知用户没有司机接单


    },


    connect() {
      const socket = new SockJS('/websocket/ws'); // 连接到后端定义的WebSocket端点
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);
        // 订阅特定用户的消息通道
        const userId = store.state.User.id;
        this.stompClient.subscribe(`/user/${userId}/queue/notifications`, notification => {
          // 当收到消息时，更新组件的message数据
          this.message = JSON.parse(notification.body).content;
          console.log('this.message :>> ', this.message);
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
      //1.发送取消请求，提示取消结果
      //2.取消成功关闭websocket连接，解除倒计时，改变页面。取消失败继续进行订单
      
      this.disconnect();
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