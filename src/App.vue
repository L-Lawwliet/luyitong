<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
    };
  }
};
</script>

<style lang="less">
@import url("http://at.alicdn.com/t/font_887708_1tl749dutea.css");
@import "~vux/src/styles/reset.less";
@import "./style/reset.css";
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  font-family: "PingFang-SC-Medium";
  -webkit-overflow-scrolling: touch;
}
#app {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
