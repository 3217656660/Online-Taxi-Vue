//配置路由相关信息
//1.导入Vue和VueRouter
import Vue from "vue";
import VueRouter from "vue-router";

const HomeComponent = () => import("../views/home/HomeComponent")
const AcceptComponent = () => import("../views/accept/AcceptComponent")
const ProfileComponent = () => import("../views/profile/ProfileComponent")
const TakeComponent = () => import("../views/take/TakeComponent")
const LoginComponent = () => import("../components/login/LoginComponent")
const RegisterComponent = () => import("../components/register/RegisterComponent")

//2.通过Vue.use(插件)，安装插件
Vue.use(VueRouter)

//配置路径和组件之间的路径关系
const routes = [
  {//默认路由，自己重定向到主页
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomeComponent
  },
  {
    path: '/accept',
    component: AcceptComponent
  },
  {
    path: '/profile',
    component: ProfileComponent
  },
  {
    path: '/take',
    component: TakeComponent
  },
  {
    path: '/login',
    component: LoginComponent
  },
  {
    path: '/register',
    component: RegisterComponent
  }
]

//3.创建VueRouter对象
const router = new VueRouter({
  routes,//名字一定要是routes
  mode: 'history'//去掉默认hash模式中的#
})

//4.将router对象传入Vue中（挂载）
export default router