export default {
  //同步修改方法

  /**
   * 修改token
   * @param {*} state 仓库
   * @param {*} token 新的token
   */
  setXToken(state, token) {
    state.XToken = token;
    localStorage.setItem('X-Token',token);
  },

  
  /**
   * 更新后端传来的不为空的用户信息
   * @param {*} state 仓库
   * @param {*} user 后端传来的不为空的用户信息
   */
  setUser(state, user){
    const keys = Object.keys(state.User)
    for (const key of keys) {
      if (user[key] !== '' && user[key] !== -1 && user[key] !== undefined)
        state.User[key] = user[key]; 
    }
    //将更新的用户信息保存到本地永久仓库
    localStorage.setItem('User', JSON.stringify(state.User));
  },


  /**
   * 更新用户的登录状态 yes表示已登录,no表示未登录
   * @param {*} state 仓库
   * @param {*} isLogin 传来的值, 表示是否登录
   */
  setIsLogin(state, isLogin){
    console.log('setIsLogin :>> ');
    state.IsLogin = isLogin;
    localStorage.setItem('IsLogin',isLogin);
  }

  
}