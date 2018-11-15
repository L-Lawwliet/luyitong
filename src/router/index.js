import Balance from './../views/modules/own/balance.vue'
import ChangePassword from './../views/modules/own/change-password.vue'
import Extension from './../views/modules/own/extension.vue'
import Layout from './../views/layout.vue'
import Login from './../views/login.vue'
import NotFound from './../views/404.vue'
import Order from './../views/modules/order.vue'
import Own from './../views/modules/own/own.vue'
import OwnInfo from './../views/modules/own/own-info.vue'
import Register from './../views/register.vue'
import Retrieve from './../views/retrieve.vue'
import Router from 'vue-router'
import Sell from './../views/modules/sell.vue'
import Share from './../views/modules/own/share.vue'
import Vue from 'vue'
import Wallet from './../views/modules/own/wallet.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: '',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }, {
    path: '/retrieve',
    name: 'Retrieve',
    component: Retrieve
  }, {
    path: '/404',
    name: '404',
    component: NotFound
  }, {
    path: '/index',
    name: 'Layout',
    component: Layout,
    redirect: '/sell',
    children: [{
        path: '/sell',
        name: 'Sell',
        component: Sell
      },
      {
        path: '/order',
        name: 'Order',
        component: Order
      },
      {
        path: '/own',
        name: 'Own',
        component: Own
      }
    ]
  }, {
    path: '/wallet',
    name: 'Wallet',
    component: Wallet
  }, {
    path: '/own-info',
    name: 'OwnInfo',
    component: OwnInfo
  }, {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword
  }, {
    path: '/balance',
    name: 'Balance',
    component: Balance
  }, {
    path: '/share',
    name: 'Share',
    component: Share
  }, {
    path: '/extension',
    name: 'Extension',
    component: Extension
  }, {
    path: '*',
    redirect: '/404'
  }]
})
