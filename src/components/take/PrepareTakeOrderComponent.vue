<template>
  <div id="prepare-take-order">
    <el-descriptions title="下单信息" column=2 size="mini" border>
      <el-descriptions-item label="起点">{{start}}</el-descriptions-item>
      <el-descriptions-item label="终点">{{end}}</el-descriptions-item>
      <el-descriptions-item label="预估距离">{{distance / 1000}}km</el-descriptions-item>
      <el-descriptions-item label="预估价格">{{price}}元</el-descriptions-item>
      <el-descriptions-item label="预计到达时间">{{arriveTimeStr}}</el-descriptions-item>
      <template slot="extra">
        <el-button size="medium" @click="takeOrder" round>下单</el-button>
        <el-button size="medium" @click="cancel" round>取消</el-button>
      </template>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  name: "PrepareTakeOrderComponent",
  props: [
    'start', 'end', 'distance', 'arriveTime'
  ],
  data() {
    return {

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

  },
  computed: {
    /**
     * 预估价格计算属性
     * 三公里内8元起步价，三公里以上每公里收2.4元
     */
    price() {
      const km = this.distance / 1000
      if (km <= 3) return 8;
      return 8 + (km-3)*2.4
    },


    /**
     * 预计到达时间计算属性
     */
    arriveTimeStr() {
      const second = this.arriveTime
      const hour = Math.floor(second / 3600)
      //分钟默认去尾+1
      const minute = Math.floor(second / 60 % 60 + 1)
      console.log('minute :>> ', minute);
      return hour >= 1 ? hour+'小时'+minute+'分钟' : minute+'分钟';
    }

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