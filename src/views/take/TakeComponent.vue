<template>
  <div id="take">
    <nav-bar-component>
      <div slot="left">
          <h3>起点</h3>
        </div>
        <div slot="center">
          <label for="startInput">
            <el-input type="text" v-model="startInput" name="startInput" placeholder="请输入省、市、区等具体位置"/>
          </label>
        </div>
        <div slot="right">
          <el-button type="text" @click="addStartBtn">选择</el-button>
        </div>
    </nav-bar-component>

    <nav-bar-component>
      <div slot="left">
        <h3>终点</h3>
        </div>
        <div slot="center">
          <label for="endInput">
            <el-input type="text" v-model="endInput" name="endInput" placeholder="请输入省、市、区等具体位置"/>
          </label>
        </div>
        <div slot="right">
          <el-button type="text" @click="addEndBtn">选择</el-button>
        </div>
    </nav-bar-component>
    
    <div id="take-map-container">
      <map-component :start-address="actionStartInput" :end-address="actionEndInput"/>
    </div>

  </div>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';

  export default {
    name: "TakeComponent",
    mixins:[checkIsLogin],
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      this.checkLogin(this)
    },
    data() {
      return {
        startInput: '',
        endInput: '',
        actionStartInput: '',
        actionEndInput: '',
      }
    },
    components: {
      NavBarComponent,
      MapComponent
    },
    methods: {
      addStartBtn(){

      },
      addEndBtn(){

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