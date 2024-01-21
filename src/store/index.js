import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";
//1.安装插件
Vue.use(Vuex);

const state = {
  XToken:'dadwdasdad1d2s3a1da23sd123add2'
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