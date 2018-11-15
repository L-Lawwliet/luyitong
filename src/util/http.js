'use strict'

import {
  Message
} from 'element-ui';
import axios from 'axios'
import {
  getCookie
} from './util'
import router from './../router/index'

// axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
  // 这里的 config 包含每次请求的内容
  // 判断 localStorage 中是否存在 token
  // console.log(config)
  // const token = getCookie('JSESSIONID'); //获取Cookie
  // config.data = JSON.stringify(config.data);
  // config.headers = {
  // 'Content-Type': 'application/x-www-form-urlencoded' //设置跨域头部
  // };
  // console.log(token)
  // if (token) {
  //     config.params = { 'JSESSIONID': token } //后台接收的参数，后面我们将说明后台如何接收
  // };
  // config.xhrFields.withCredentials = true;
  // if (localStorage.getItem('sessionid')) {
  //     config.headers.Cookie = 'JSESSIONID=' + localStorage.getItem('sessionid')
  // }
  // config.headers.Cookie = localStorage.getItem('sessionid') ? 'JSESSIONID=' + localStorage.getItem('sessionid') : 'JSESSIONID=';
  // if (localStorage.getItem('token')) {
  //     //  存在将 token写入 request header
  //     config.headers.Authorization = `Basic ${localStorage.getItem('token')}`;
  // }
  // // let guId = (localStorage.getItem('guId') || "").replace(/\"/g, "");
  // if (localStorage.getItem('guId')) {
  //     // guId = this.newGuid();
  //     // localStorage.setItem('guId', JSON.stringify(guId));
  //     config.headers.LoginMac = (localStorage.getItem('guId')).replace(/\"/g, "");
  // }
  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(response => {
  checkStatus(response);
  return response
}, err => {
  checkStatus(err.response);
  return err.response;
})

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304)) {
    if (response.data.code === '9999') {
      Message('登录过期，请重新登录');
      setTimeout(() => {
        routerLogin();
      }, 2000);
    } else {
      return response;
    }
  }
  // 异常状态下，把错误信息返回去
  else if (response.status === 400) {
    Message('请求无效')
  } else if (response.status === 401) {
    Message('未登录或登录已失效,请重新登录')
    routerLogin();
  } else if (response.status === 404) {
    Message('请求无效')
  } else if (response.status === 500) {
    Message('服务器错误')
  }
}

function routerLogin() {
  if (router) {
    router.push("/login");
  }
}

// 请求方式的配置
export default {
  post(url, data) { //  post
    let params = new URLSearchParams();
    for (var key in data) {
      params.append(key, data[key]);
    }
    return axios({
      method: 'post',
      url,
      // baseURL: '/lyt',
      data: params,
      headers: {
        // 'Cookie': 'JSESSIONID=' + localStorage.getItem('sessionid')
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json',
      },
      // xhrFields: {
      // withCredentials: true
      // },
    })
  },
  get(url, params) { // get
    return axios({
      method: 'get',
      url,
      // baseURL: '/lyt',
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Cookie': 'JSESSIONID=' + localStorage.getItem('sessionid')
      },
      // xhrFields: {
      // withCredentials: true
      // },
    })
  }
}
