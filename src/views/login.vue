<template>
  <div class="login">
    <x-header :left-options="{showBack: false}" style="background-color:transparent;">
      <div class="overwrite-title" slot="overwrite-title">登录</div>
    </x-header>
    <group>
      <div class="login-form">
        <x-input v-model="account" placeholder="请输入手机号/账号"></x-input>
        <x-input v-model="password" placeholder="请输入密码" :type="showPassword?'text':'password'">
          <span slot="right" @click="showPassword=!showPassword">
            <i v-if="showPassword" class="iconfont icon-mimakejian"></i>
            <i v-if="!showPassword" class="iconfont icon-mimabukejian"></i>
          </span>
        </x-input>
        <div class="line"></div>
        <div class="tips" v-if="tips">{{tips}}</div>
      </div>
    </group>
    <div class="login-btn">
      <x-button @click.native="login">登录</x-button>
    </div>
    <div class="login-sm-btn">
      <a class="forget" @click="linkTo('retrieve')">忘记密码？</a>
      <a class="register" @click="linkTo('register')">立即注册</a>
    </div>
  </div>
</template>

<script>
import api from './../api/api.js';
import { setCookie } from './../util/util.js';
import { XHeader, XInput, XButton, Group } from "vux";
export default {
  data() {
    return {
      account: '',
      password: '',
      showPassword: false,
      tips: '',
      canLogin: true
    };
  },
  mounted() {
    if (this.$route.params.userName) {
      this.account = this.$route.params.userName;
      this.password = '';
    }
  },
  methods: {
    linkTo(path) {
      this.$router.push(path);
    },
    login() {
      if (!this.canLogin) return;
      if (this.account === '' || this.password === '') {
        this.tips = '请输入账号和密码！';
        return false;
      }
      let params = {
        userName: this.account,
        password: this.password
      };
      this.tips = '登录中...';
      this.canLogin = false;
      api.login(params).then(res => {
        this.tips = '';
        if (res.data.msg_code === 'success') {
          let expireDays = 1000 * 60 * 60 * 24;
          setCookie('JSESSIONID', res.data.sessionid, expireDays);
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          api.getUserInfo().then(r => {
            let user = r.data.result;
            localStorage.setItem('user', JSON.stringify(user));
          })
          setTimeout(() => {
            this.linkTo('sell');
          }, 1000);
        } else {
          this.canLogin = true;
          this.$message({
            type: 'info',
            message: res.data.msg
          })
        }
      })
    }
  },
  components: {
    XHeader,
    XInput,
    XButton,
    Group
  }
};
</script>

<style scoped>
.login {
  background: url("./../assets/img/back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  height: 100%;
}
.overwrite-title {
  color: #fff;
}
.login-form {
  margin: 0 2em 0 1.2em;
}
.login-form .iconfont {
  color: #fff;
}
.login-btn {
  margin-top: 2.6em;
  padding: 0 2em;
}
.login-sm-btn {
  margin: 1.2em 2em;
  color: #fff;
}
.login-sm-btn .register {
  font-size: 1em;
  float: right;
}
.login-sm-btn .forget {
  font-size: 1em;
}
.login .line {
  width: calc(100% - 1em);
  margin-left: 1em;
  border-bottom: 1px solid #d9d9d9 !important;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.login >>> .weui-cells:before,
.login >>> .weui-cells:after {
  border-top: 0 !important;
  border-bottom: 0 !important;
}
.login >>> .weui-cell:before {
  border-top: 0 !important;
  border-bottom: 1px solid #d9d9d9 !important;
  left: 15px !important;
}
.tips {
  color: #fff;
  padding-left: 0.8em;
  margin-top: 1em;
}
.login >>> input::-webkit-input-placeholder {
  color: #fff;
}
.login >>> input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #fff;
}
.login >>> input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #fff;
}
.login >>> input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #fff;
}
</style>
