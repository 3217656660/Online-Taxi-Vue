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
        <el-button round @click="submit" class="login-btn">登录！</el-button>
        <div class="login-link-container">
            <el-link style="position: relative;margin-left: 15%;">忘记密码？</el-link>
            <el-link style="position: relative;margin-left: 40%;" @click="goRegister">去注册！</el-link>
        </div>
      </el-form>
  </div>
</template>

<script>
import { submitFormMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';

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
        password: '',
      },
      
      rules: {
        mobile: [ {validator: validateMobile, trigger: 'blur'} ],
        password: [ {validator: validatePassword, trigger: 'blur'} ]
      }
    }
  },
  mixins: [submitFormMixin],
  methods: {
    /**
     * 登录
     */
    submit() {
      this.submitForm(this, {
        url: '/api/user/login',
        method: 'post',
        data: this.user
      });
    },

    /**
     * 去注册
     */
    goRegister(){
      this.$router.push('/register')
    },
    
    /**
     * 去修改密码
     */
    goModifyPassword(){
      this.$router.push('/modifyPassword')
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
    font-size: 30px;
  }

  .login-link-container{
    position: relative;
  }
</style>