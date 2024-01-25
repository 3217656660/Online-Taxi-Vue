<template>
    <h2>个人</h2>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';
  export default {
    name: "ProfileComponent",
    mixins:[checkIsLogin],
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      this.checkLogin(this)
    },
  }
</script>

<style scoped>

</style>