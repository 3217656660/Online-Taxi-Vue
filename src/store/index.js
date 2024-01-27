import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";
//1.安装插件
Vue.use(Vuex);

//获取本地存储的用户信息，并初始化到vuex中，注意：在修改的时候要将本地永久存储的一并需改
let localUser = JSON.parse( localStorage.getItem('User') )
if ( localUser === null ) {
  localUser = {
    id: -1,
    username: '',
    mobile: '',
    password: '',
    email: ''
  };
}

const state = {
  XToken: localStorage.getItem('X-Token'),
  User: {
    id: localUser.id,
    username: localUser.username,
    mobile: localUser.mobile,
    password: localUser.password,
    email: localUser.email
  },
  City: '',
  HomePosition: [],
  TakePosition: [],
  AcceptPosition: [],
  IsLogin: localStorage.getItem('IsLogin')
  
}

//2.创建对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules
});

//3.导出
export default store;