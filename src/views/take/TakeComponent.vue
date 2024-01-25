<template>
    <h2>打车</h2>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';

  export default {
    name: "TakeComponent",
    mixins:[checkIsLogin],
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      this.checkLogin(this)
    },
    methods: {

    }

  }
</script>

<style scoped>
</style>