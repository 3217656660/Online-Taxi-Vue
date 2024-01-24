
/**
 * 正则表达式
 */
export const regex = {
  //1.手机号匹配
  phoneRegex : /^\d{11}$/,

  //2.密码匹配
  passwordRegex : /^[a-zA-Z0-9]{1,10}$/, //   /^[a-zA-Z0-9]{6,10}$/

  //3.用户名匹配
  userNameRegex : /^[a-zA-Z0-9]{1,10}$/ //   /^[a-zA-Z0-9]{6,10}$/

};


/**
 * 设置为只读
 */
Object.defineProperty(regex, 'userNameRegex', {
  value: regex.userNameRegex,
  writable: false,
});
Object.defineProperty(regex, 'phoneRegex', {
  value: regex.phoneRegex,
  writable: false,
});
Object.defineProperty(regex, 'passwordRegex', {
  value: regex.passwordRegex,
  writable: false,
});