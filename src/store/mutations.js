export default {
  //同步修改方法

  /**
   * 修改token
   * @param {*} state 仓库
   * @param {*} token 新的token
   */
  setXToken(state, token) {
    state.XToken = token;
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
  },

  
}