<template>
  <div class="retrieve">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title" v-if="step===1">找回密码</div>
      <div class="overwrite-title" slot="overwrite-title" v-if="step===2">重设密码</div>
    </x-header>
    <group>
      <div class="retrieve-form" v-if="step===1">
        <x-input v-model="phone" placeholder="请输入手机号"></x-input>
        <x-input v-model="code" placeholder="请输入验证码">
          <a slot="right" class="primary" v-if="canSend" @click="sendCode">获取验证码</a>
          <span slot="right" v-else>{{countDown}}秒后可重发</span>
        </x-input>
        <div class="text-warn" v-if="showTips">{{tips}}</div>
      </div>
      <div class="retrieve-form" v-if="step===2">
        <x-input v-model="phone" placeholder="请输入手机号"></x-input>
        <x-input v-model="password" placeholder="请输入密码" :type="showPassword?'text':'password'">
          <span slot="right" @click="showPassword=!showPassword">
            <i v-if="showPassword" class="iconfont icon-mimabukejian"></i>
            <i v-if="!showPassword" class="iconfont icon-mimakejian"></i>
          </span>
        </x-input>
      </div>
    </group>
    <div :class="[{success:!hasError},{error:hasError}]">{{result}}</div>
    <div class="retrieve-btn">
      <x-button type="primary" @click.native="next" v-if="step===1">下一步</x-button>
      <x-button type="primary" v-if="step===2" @click.native="forgetPassword">完成</x-button>
    </div>
  </div>
</template>

<script>
import api from './../api/api.js';
import { XHeader, XInput, XButton, Group } from "vux";
export default {
  data() {
    return {
      phone: "",
      code: '',
      password: "",
      showPassword: false,
      step: 1,
      canSend: true,
      countDown: 59,
      tips: '',
      timer: null,
      showTips: false,
      hasError: false,
      result: ''
    };
  },
  methods: {
    next() {
      if (this.phone === '') {
        this.showTips = true;
        this.tips = '请输入手机号';
        return false;
      }
      if (this.code === '') {
        this.showTips = true;
        this.tips = '请输入验证码';
        return false;
      }
      clearInterval(this.timer);
      this.countDown = 59;
      this.canSend = true;
      this.step = 2;
    },
    sendCode() {
      if (this.phone === '') {
        this.showTips = true;
        this.tips = '请输入手机号';
        return false;
      }
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
          this.showTips = true;
          this.tips = res.data.msg;
        }
      })
    },
    forgetPassword() {
      let params = {
        PHONE: this.phone,
        PASSWORD: this.password,
        CODE: this.code
      };
      api.forgetPassword(params).then(res => {
        if (res.data.msg_code === 'success') {
          this.result = res.data.msg;
          this.hasError = false;
          setTimeout(() => {
            this.$router.push({ name: 'Login', path: 'login', params: { userName: this.phone } });
          }, 1000);
        } else {
          this.result = res.data.msg;
          this.hasError = true;
          this.step = 1;
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
.retrieve-form {
  margin: 0 2em;
}
.retrieve-btn {
  margin-top: 2.6em;
  padding: 0 2em;
}
.primary {
  color: #e66456;
  float: right;
}
.retrieve >>> .weui-cells:before,
.retrieve >>> .weui-cells:after {
  border-top: 0 !important;
  border-bottom: 0 !important;
}
.retrieve >>> .weui-cell:before {
  border-top: 0 !important;
  border-bottom: 1px solid #d9d9d9 !important;
}
.text-warn {
  color: red;
  margin-left: 1em;
  margin-top: 0.5em;
}
.success {
  margin-left: 2em;
  color: green;
}
.error {
  margin-left: 2em;
  color: red;
}
</style>
