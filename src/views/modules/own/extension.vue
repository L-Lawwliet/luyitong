<template>
  <div class="extension">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">推广海报</div>
    </x-header>
    <div class="content">
      <img class="bg" :src="'./static/img/bg.png'" alt="">
      <div class="title">邀好友 领红包</div>
      <div class="user">
        <el-col :span="9" class="ta-r">
          <img :src="'./static/img/icon.png'" alt="" width="70">
        </el-col>
        <el-col :span="13" :offset="1" class="ta-l">{{user.PHONE}}</el-col>
      </div>
      <div class="qrcode">
        <img :src="qrcodeUrl" alt="">
        <div class="mark">每邀请一位好友注册即送3元红包</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from './../../../api/api.js';
import { XHeader, Qrcode } from "vux";
export default {
  data() {
    return {
      showDetail: false,
      qrcodeUrl: ''
    };
  },
  mounted() {
    this.getQCode();
  },
  methods: {
    getQCode() {
      let url = window.location.href;
      let params = {
        url: 'http://www.luyitong.cc/#/register',
        note: ''
      };
      api.getShareQRcode(params).then(res => {
        this.qrcodeUrl = res.data;
      })
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'));
    }
  },
  components: {
    XHeader,
    Qrcode
  }
};
</script>

<style scoped>
.extension {
  width: 100%;
  height: 100%;
  position: fixed;
}
.content {
  height: calc(100% - 3em);
  position: relative;
  overflow: auto;
}
.bg {
  width: 100%;
  height: 37.5em;
  position: absolute;
  top: 0;
  z-index: -1;
}
.content .title {
  text-align: center;
  color: #fff;
  font-weight: bolder;
  font-size: 1.8em;
  padding-top: 1.2em;
}
.content .user {
  margin-top: 20%;
  line-height: 2em;
  height: 2em;
}
.content .qrcode {
  text-align: center;
  position: relative;
  margin-top: 4.5em;
}
.content .qrcode img {
  position: absolute;
  left: calc(50% - 6em);
  top: 0;
  width: 12em;
}
.content .qrcode .mark {
  position: absolute;
  top: 12.8em;
  text-align: center;
  width: 100%;
  font-size: 1em;
}
</style>
