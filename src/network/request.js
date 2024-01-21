import axios from "axios";

export function request(config){
    //1.创建axios实例
    const instance = axios.create({
      baseURL:'http://127.0.0.1',
      timeout: 5000
    })
    //2.1 axios拦截器
    //全局拦截axios.interceptors
    //局部拦截
    instance.interceptors.request.use(config => {
      //1.可以检验config信息

      //2.每次发送请求的时候，显示加载图标

      //3.某些网络请求必须携带信息，如（token）

      //一定要发送回去，不然无法请求
      return config 
    },error => {
    //一般请求没有发出去的时候进入
    })

    //2.2响应拦截
    instance.interceptors.response.use(result => {
      //一定要发送回去，不然无法接受响应
      return result
    },error => {
    //一般响应错误的时候进入
    })

    //3.发送真正的网络请求并以Promise返回
    return instance(config)
}