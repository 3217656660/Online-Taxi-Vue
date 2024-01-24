<template>
  <div id="login">
    <nav-bar-component>
      <div slot="left">
          <el-button class="back-btn" @click="changeColorAndBack">
            <i class="el-icon-back" :style="navColor"></i>
          </el-button>
        </div>
    </nav-bar-component>
    
    <div id="login-form-container">
      <login-form-component/>
    </div>
  </div>
</template>

<script>
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import LoginFormComponent from './LoginFormComponent.vue';
export default {
  name: "LoginComponent",
  data() {
    return {
      //返回按钮颜色，默认黑色，返回灰色
      navColor: {
        color:'black'
      } 
    }
  },
  components: {
    NavBarComponent,
    LoginFormComponent
  },
  methods: {
    /**
     * 改变颜色并返回
     */
    changeColorAndBack(){
      this.navColor.color = this.navColor.color === 'black' ? 'darkgray' : 'black';
      this.$router.back()
    },

  }

}
</script>

<style scoped>
.el-icon-back{
  font-size: 25px;
}

.back-btn{
  /* 让按钮透明 */
  background-color: transparent;
  border-color: transparent;
}

#login-form-container{
  position: relative;
  margin-top: 80px;
  width: 100%;
  height: 600px;
}

</style>