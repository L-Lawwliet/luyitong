<template>
  <div class="own">
    <div class="header">
      <div class="header-wrapper" @click="linkTo('own-info')">
        <el-col :span="5">
          <i class="iconfont icon-touxiang-"></i>
        </el-col>
        <el-col :span="19">
          <el-col :span="22">
            <div class="user-name">{{user.PHONE}}</div>
            <div class="user-id">ID: {{user.ID}}</div>
          </el-col>
          <el-col :span="2" class="right-arrow">
            <i class="iconfont icon-right"></i>
          </el-col>
        </el-col>
      </div>
    </div>
    <group class="content">
      <cell title="钱包" is-link @click.native="linkTo('wallet')">
        <i slot="icon" class="iconfont icon-shiliangzhinengduixiang"></i>
      </cell>
      <cell title="分享" is-link @click.native="linkTo('share')">
        <i slot="icon" class="iconfont icon-fenxiang"></i>
      </cell>
      <cell title="联系客服" is-link @click.native="showDialog=true">
        <i slot="icon" class="iconfont icon-kefu"></i>
      </cell>
      <cell title="退出登录" is-link @click.native="show=true">
        <i slot="icon" class="iconfont icon-tuichudenglu"></i>
      </cell>
    </group>

    <div v-transfer-dom>
      <confirm v-model="show" title="提示" @on-confirm="loginOut">
        <p style="text-align:center;">确定要退出登录？</p>
      </confirm>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showDialog" hide-on-blur>
        <div class="dialog-content">
          <div class="dialog-title">联系客服</div>
          <div class="dialog-remarks">点击号码可复制</div>
          <el-row class="dialog-qq">
            <el-col :span="8" class="ta-r">客服QQ</el-col>
            <el-col :span="16" v-clipboard:copy="3129544185" v-clipboard:success="onCopy">3129544185</el-col>
          </el-row>
          <el-row class="dialog-qq">
            <el-col :span="8" class="ta-r">客服QQ</el-col>
            <el-col :span="16" v-clipboard:copy="2641992472" v-clipboard:success="onCopy">2641992472</el-col>
          </el-row>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import api from './../../../api/api.js';
import { Group, Cell, Confirm, XDialog } from "vux";
import { delCookie } from './../../../util/util.js';
export default {
  data() {
    return {
      show: false,
      showDialog: false
    };
  },
  methods: {
    linkTo(path) {
      this.$router.push(path);
    },
    loginOut() {
      api.loginOut().then(res => {
        if (res.data.msg_code === 'success') {
          delCookie('JSESSIONID');
          this.$router.push('login');
        }
      })
    },
    onCopy(){
      this.$message({
        type: 'success',
        message: '复制成功！'
      })
    },
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'));
    }
  },
  components: {
    Group,
    Cell,
    Confirm,
    XDialog
  }
};
</script>

<style scoped>
.own {
  height: calc(100% - 6.6em);
  overflow: auto;
}
.header {
  height: 10em;
  color: #fff;
  background: url("./../../../assets/img/back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
}
.header-wrapper {
  padding: 1.8em 0.2em 0 1.2em;
}
.icon-touxiang- {
  font-size: 4em;
}
.right-arrow {
  line-height: 6em;
}
.user-name {
  margin-top: 1.2em;
  font-size: 1.2em;
  margin-left: 0.5em;
}
.user-id {
  margin-top: 0;
  margin-left: 0.5em;
}
.own .content .iconfont {
  font-size: 1.2em;
  color: #e66456;
  margin-right: 0.8em;
}
.dialog-content {
  padding: 1em 1.2em;
}
.dialog-title {
  font-family: "PingFang-SC-Bold";
  font-size: 1em;
  color: #333;
  margin-bottom: 1em;
}
.dialog-remarks{
  font-family: 'PingFang-SC-Medium';
  font-size: 0.6em;
  color: #666;
  margin-top: -1.25em;
}
.dialog-qq{
  font-family: 'PingFang-SC-Medium';
  font-size: 1em;
  color: #333;
  padding: 0.25em;
}
</style>
