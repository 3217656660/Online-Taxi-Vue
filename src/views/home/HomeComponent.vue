<template>
    <div id="home">
      <nav-bar-component>
        <div slot="left">
          <i class="el-icon-search"></i>
        </div>
        <div slot="center">
          <label for="searchinput">
            <el-input type="text" v-model="searchInput" name="searchinput" placeholder="请输入省、市、区等具体位置"/>
          </label>
        </div>
        <div slot="right">
          <el-button type="text" @click="searchBtn">搜索</el-button>
        </div>
      </nav-bar-component>
      <div id="map-container">
        <map-component :address="actionInput"/>
      </div>
    </div>
</template>

<script>
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { InputIsNull } from '../../common/string';

export default {
    name: "HomeComponent",
    components: {
      NavBarComponent,
      MapComponent
    },
    data() {
      return {
        searchInput: '',
        actionInput: ''
      }
    },
    methods: {
      searchBtn() {
        //判空
        if(this.searchInput === '') {
          this.$message({
          showClose: true,
          message: '' + InputIsNull,
          type: 'warning',
          offset: '60'
          })
          return;
        } 
        //给子组件通信
        this.actionInput = this.searchInput
      }
    },
    
  }
</script>

<style scoped>
  #home{
    width: 100%;
    height: 840px;
    position: relative;
  }
  #map-container{
    position: relative;
    width: 100%;
    height: 95%;
  }
</style>