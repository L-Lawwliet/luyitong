<template>
  <el-row class="layout">
    <router-view class="content"></router-view>
    <el-row class="footer">
      <el-col :span="8" @click.native="linkTo('sell')" :class="{active:$route.name==='Sell'}">
        <div class="icon">
          <img :src="$route.name==='Sell'?'./static/img/sell-selected.png':'./static/img/sell.png'" alt="" width="28">
        </div>
        <div class="text">出售</div>
      </el-col>
      <el-col :span="8" @click.native="linkTo('order')" :class="{active:$route.name==='Order'}">
        <div class="icon">
          <img :src="$route.name==='Order'?'./static/img/order-selected.png':'./static/img/order.png'" alt="" width="28">
        </div>
        <div class="text">订单</div>
      </el-col>
      <el-col :span="8" @click.native="linkTo('own')" :class="{active:$route.name==='Own'}">
        <div class="icon">
          <img :src="$route.name==='Own'?'./static/img/own-selected.png':'./static/img/own.png'" alt="" width="28">
        </div>
        <div class="text">我的</div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import api from "./../api/api.js";
export default {
  data() {
    return {
    };
  },
  methods: {
    linkTo(path) {
      this.$router.push(path);
    }
  },
};
</script>

<style scoped>
.layout {
  height: 100%;
  background: #f5f5f5;
  position: fixed;
  width: 100%;
}
.layout >>> .vux-header-title-area {
  margin: 0 1em;
}
.content{
  height: 100%;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3em;
  text-align: center;
  background-color: #fff;
}
.footer .icon {
  padding-top: 0.1em;
}
.footer .text {
  font-family: "PingFang-SC-Medium";
  font-size: 0.7em;
  margin-top: -0.6em;
  color: #808080;
}
.footer .active .icon,
.footer .active .text {
  color: #e66456;
}
</style>
