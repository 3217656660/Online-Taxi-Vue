<template>
  <div id="loginForm">
    <h2 id="login-text">登录</h2>
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="0px" class="userForm">
        <div class="input-container">
          <el-form-item prop="mobile">
            <el-input type="text" v-model="user.mobile" autocomplete="off" placeholder="请输入手机号" class="input">
            </el-input>
          </el-form-item>
        </div>
        <div class="input-container">
          <el-form-item prop="password">
            <el-input type="password" v-model="user.password" autocomplete="off" placeholder="请输入密码" class="input">
            </el-input>
          </el-form-item>
        </div>
        <el-button round @click="submitForm" class="login-btn">登录！</el-button>
        <div class="login-link-container">
            <el-link style="position: relative;margin-left: 15%;">忘记密码？</el-link>
            <el-link style="position: relative;margin-left: 40%;">去注册！</el-link>
        </div>
      </el-form>
  </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "LoginFormComponent",
  data() {
    //手机号校验
    let validateMobile = (rule, value, callback) => {
      if( !regex.phoneRegex.test(value) )
        callback(new Error(Error_Msg.PHONE_REGEX_ERROR));
      else
        callback();
    };

    //密码校验
    let validatePassword = (rule, value, callback) => {
      if( !regex.passwordRegex.test(value) )
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else
        callback();
    };
    return {
      user: {
        mobile:'',
        password: ''
      },
      rules: {
        mobile: [ {validator: validateMobile, trigger: 'blur'} ],
        password: [ {validator: validatePassword, trigger: 'blur'} ]
      }
    }
  },
  methods: {
    submitForm() {
      const vm = this
      //数据格式校验
      vm.$refs.user.validate( (valid) => {
        if ( !valid ){
          vm.$message({showClose: true,message: "登录失败",type: 'error',offset: '60'})
          return false;
        }
        requestGateway({
          url: '/api/user/login',
          method: 'post',
          data: vm.user
        })
        .then(res => {
          if (Object.values(Error_Msg).includes(res.data)) {
            vm.$message({showClose: true,message: res.data,type: 'innfo',offset: '60'})
            return;
          } 
          
          vm.$message({showClose: true,message: "登录成功",type: 'success',offset: '60'})
          //将用户信息传入vuex中修改
          store.commit('setUser',res.data)
          //将真实密码更新到其中
          store.commit('setUser',vm.user)
        })
        .catch(err => {vm.$message({showClose: true,message: err,type: 'error',offset: '60'})})
      });
    }

  }

}


</script>

<style scoped>
  #loginForm{
    width: 100%;
    height: 100%;
  }

  #login-text{
    text-align: center;
  }

  .input-container{
    position: relative;
    margin-left: 15%;
    margin-top: 15%;
    width: 70%;
  }

  .login-btn{
    position: relative;
    margin-top: 5%;
    margin-left: 15%;
    width: 70%;
    height: 60px;
  }

  .input{
    font-size: 38px;
  }

  .login-link-container{
    position: relative;
  }
</style>