import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import ElementUI from 'element-ui'
import Es6Promise from 'es6-promise'
import FastClick from 'fastclick'
import {
    TransferDom
} from 'vux'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueClipboard)
Es6Promise.polyfill();
Vue.config.productionTip = false
FastClick.attach(document.body);
Vue.use(ElementUI)
Vue.use(VueRouter)
router.beforeEach((to, from, next) => {
    let id = '';
    if (localStorage.getItem('user')) {
        id = JSON.parse(localStorage.getItem('user')).ID;
    }
    if (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Retrieve') {
        if (!id) {
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
})
Vue.directive('transfer-dom', TransferDom)
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})