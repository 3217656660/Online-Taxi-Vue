<template>
  <div id="registerForm">
    <h2 id="register-text">注册</h2>
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="0px" class="userForm">
        <div class="input-container">
          <el-form-item prop="mobile">
            <el-input type="text" v-model="user.mobile" autocomplete="off" placeholder="请输入手机号" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="username">
            <el-input type="text" v-model="user.username" autocomplete="off" placeholder="请输入用户名" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="password">
            <el-input type="password" v-model="user.password" autocomplete="off" placeholder="请输入密码" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="confirmPassword">
            <el-input type="password" v-model="user.confirmPassword" autocomplete="off" placeholder="请再次确认您的密码" class="input">
            </el-input>
          </el-form-item>
        </div>

        <el-button round @click="submit" class="login-btn" :disabled="!agree">注册！</el-button>
        <div class="login-link-container">
          <span style="position: relative;margin-left: 10%;">同意协议？</span>
          <el-switch style="position: relative;margin-left: 1%;"
            v-model="agree"
            active-text="同意"
            inactive-text="不同意">
          </el-switch>
          <el-link style="position: relative;margin-left: 10%;">
            查看协议
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </div>
      </el-form>
  </div>
</template>

<script>
import { submitFormMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';

export default {
  name: "RegisterFormComponent",
  data() {
    //手机号校验
    let validateMobile = (rule, value, callback) => {
      if( !regex.phoneRegex.test(value) )
        callback(new Error(Error_Msg.PHONE_REGEX_ERROR));
      else
        callback();
    };

    //用户名校验
    let validateUsername = (rule, value, callback) => {
      if( !regex.userNameRegex.test(value) )
        callback(new Error(Error_Msg.USERNAME_REGEX_ERROR));
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

    //再次确认密码校验
    let validateConfirmPassword = (rule, value, callback) => {
      if( !regex.passwordRegex.test(value) )
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else if ( value !== this.user.password )
        callback(new Error(Error_Msg.CONFIRMPASSWORD_REGEX_ERROR));
      else
        callback();
    };

    return {
      user: {
        mobile:'',
        username:'',
        password: '',
        confirmPassword:''
      },
      rules: {
        mobile: [ {validator: validateMobile, trigger: 'blur'} ],
        username: [ {validator: validateUsername, trigger: 'blur'} ],
        password: [ {validator: validatePassword, trigger: 'blur'} ],
        confirmPassword: [ {validator: validateConfirmPassword, trigger: 'blur'} ]
      },
      agree: false
    }
  },
  mixins: [submitFormMixin],
  methods: {
    /**
     * 注册
     */
    submit() {
      if( !this.agree ) return;
      this.submitForm(this, {
        url: '/api/user/register',
        method: 'post',
        data: this.user
      })
    },
    
  }
}
</script>

<style scoped>
  #registerForm{
    width: 100%;
    height: 100%;
  }

  #register-text{
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
    margin-top: 8%;
  }
</style>