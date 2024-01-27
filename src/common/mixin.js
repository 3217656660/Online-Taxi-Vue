import { Error_Msg } from '@/common/string';
import { requestGateway } from '@/network/request';
import store from '@/store';
export const submitFormMixin = {
  methods: {
    /**
     * 注册登录通用提交函数
     * @param {*} context 当前上下文（vue实例）
     * @param {*} config 提交配置
     */
    submitForm(context , config) {
      const vm = context
      //数据格式校验
      vm.$refs.user.validate( (valid) => {
        if ( !valid ){
          vm.$message({showClose: true,message: "失败",type: 'error',offset: '60'})
          return;
        }
        requestGateway(config)
        .then(res => {
          if (Object.values(Error_Msg).includes(res.data)) {
            vm.$message({showClose: true,message: res.data,type: 'innfo',offset: '60'})
            return;
          } 
          //将用户信息传入vuex中修改
          store.commit('setUser', res.data)
          //将密码更新到vuex其中
          store.commit('setUser', {password: vm.user.password})
          //设置用户的在本地永久存储的状态
          if(vm.$route.path === '/login') 
            store.commit('setIsLogin', "yes")
          //退回
          vm.$router.back()
          vm.$message({showClose: true,message: "成功",type: 'success',offset: '60'})
        })
      .catch(err => {vm.$message({showClose: true, message: err, type: 'error', offset: '60'})})
      });
    },

  }

}

export const checkIsLogin = {
  methods: {
    /**
     * 判断用户登录状态通用函数
     * @param {*} context 上下文（vue实例）
     * @returns 
     */
    checkLogin(context){
      const vm = context;
      const userId = store.state.User.id;
      if( userId <= 0 || store.state.XToken === '' ) {
        vm.$router.push('/login')
        vm.$message({showClose: true, message: Error_Msg.PLEASE_LOGIN, type: 'error', offset: '60'})
        return;
      }
      //去后端校验
      requestGateway({
        url: '/api/user/getById/' + userId,
        method: 'get'
      }).then(res => {
        if (res.response !== undefined && res.response.status === 401){
          vm.$router.push('/login')
          vm.$message({showClose: true, message: Error_Msg.PLEASE_LOGIN, type: 'error', offset: '60'})
          return;
        }
      });
    },
    
  }
}