<template>
    <div id="home">
      <nav-bar-component>
        <div slot="left">
          <i class="el-icon-search"></i>
        </div>
        <div slot="center">
          <label for="searchinput">
            <el-input type="text" v-model="searchInput" name="searchinput" placeholder="查找地点、公交"/>
          </label>
        </div>
        <div slot="right">
          <el-button type="text" @click="searchBtn">搜索</el-button>
        </div>
      </nav-bar-component>

      <map-component :address="actionInput"/>
    </div>
</template>

<script>
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
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
        if(this.searchInput === null) return;
        
        //给子组件通信
        this.actionInput = this.searchInput
      }
    },
    
  }
</script>

<style scoped>

</style>