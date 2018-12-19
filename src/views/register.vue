<template>
  <div class="register">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">注册</div>
    </x-header>
    <group>
      <div class="register-form">
        <x-input v-model="phone" placeholder="请输入手机号"></x-input>
        <x-input v-model="password" placeholder="请输入密码" :type="showPassword?'text':'password'">
          <span slot="right" @click="showPassword=!showPassword">
            <i v-if="showPassword" class="iconfont icon-mimakejian"></i>
            <i v-if="!showPassword" class="iconfont icon-mimabukejian"></i>
          </span>
        </x-input>
        <x-input v-model="code" placeholder="请输入验证码">
          <a slot="right" @click="getCodeForPhone" class="code" v-if="canSend">获取验证码</a>
          <span slot="right" v-else>{{countDown}}秒后可重发</span>
        </x-input>
        <x-input v-model="shareId" placeholder="请输入邀请码" v-if="!hasCode">
          <span slot="right" @click="showPassword=!showPassword" class="select">选填</span>
        </x-input>
        <div class="line"></div>
        <div :class="[{success:!hasError},{error:hasError}]" v-if="tips">{{tips}}</div>
      </div>
    </group>
    <div class="register-btn">
      <x-button type="primary" @click.native="register">注册</x-button>
    </div>
  </div>
</template>

<script>
import api from './../api/api.js'
import { XHeader, XInput, XButton, Group } from "vux";
import { clearTimeout } from 'timers';
export default {
  data() {
    return {
      password: '',
      phone: '',
      shareId: '',
      code: '',
      showPassword: false,
      canSend: true,
      countDown: 59,
      timer: null,
      hasError: false,
      tips: '',
      hasCode: false,
    };
  },
  mounted() {
    this.getRequest();
  },
  methods: {
    getRequest() {
      var url = location.href;
      if (url.indexOf('?') !== -1) {
        var str = url.split('?')[1].split('=')[1];
        if (url.indexOf('&') !== -1) {
          str = str.split('&')[0];
        }
        this.shareId = str || '';
        this.hasCode = this.shareId === '';
      }
    },
    register() {
      if (this.phone === '') {
        this.hasError = true;
        this.tips = '请输入手机号';
        this.$forceUpdate();
        return false;
      }
      if (this.password === '') {
        this.hasError = true;
        this.tips = '请输入密码';
        this.$forceUpdate();
        return false;
      }
      if (this.code === '') {
        this.hasError = true;
        this.tips = '请输入验证码';
        this.$forceUpdate();
        return false;
      }
      let params = {
        PHONE: this.phone,
        NAME: this.phone,
        PASSWORD: this.password,
        SHARE_USER_ID: this.shareId,
        CODE: this.code
      };
      this.hasError = false;
      api.register(params).then(res => {
        if (res.data.msg_code === 'success') {
          this.hasError = false;
          this.tips = '注册成功！';
          setTimeout(() => {
            this.$router.push({ name: 'Login', path: 'login', params: { userName: res.data.USERNAME } });
          }, 1000);
        } else {
          this.hasError = true;
          this.tips = res.data.msg;
        }
      });
    },
    getCodeForPhone() {
      if (this.phone === '') {
        this.hasError = true;
        this.tips = '请输入手机号';
        return false;
      }
      this.hasError = false;
      this.tips = '';
      api.getCodeForPhone({ PHONE: this.phone }).then(res => {
        if (res.data.code === 100) {
          this.canSend = false;
          this.timer = setInterval(() => {
            this.countDown--;
            if (this.countDown === -1) {
              clearInterval(this.timer);
              this.countDown = 59;
              this.canSend = true;
            }
          }, 1000)
        } else {
          this.hasError = true;
          this.tips = res.data.pd.msg;
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
.register-form {
  margin: 0 1.8em 0 1em;
}
.register-btn {
  margin-top: 2.6em;
  padding: 0 2em;
}
.code {
  color: #e66456;
  font-size: 1em;
}
.select {
  font-size: 1em;
}
.primary {
  color: #e66456;
  float: right;
}
.register .line {
  width: calc(100% - 1em);
  margin-left: 1em;
  border-bottom: 1px solid #d9d9d9 !important;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.register >>> .weui-cells:before,
.register >>> .weui-cells:after {
  border-top: 0 !important;
  border-bottom: 0 !important;
}
.register >>> .weui-cell:before {
  border-top: 0 !important;
  border-bottom: 1px solid #d9d9d9 !important;
  left: 15px !important;
}
.success {
  color: green;
  margin: 1em 0 0 1em;
}
.error {
  color: red;
  margin: 1em 0 0 1em;
}
</style>
