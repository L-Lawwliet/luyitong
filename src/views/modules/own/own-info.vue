<template>
  <div class="own-info">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">我的资料</div>
    </x-header>
    <group>
      <cell title="用户名" :value="user.PHONE"></cell>
      <cell title="ID" :value="user.ID"></cell>
      <cell title="手机号" :value="user.PHONE"></cell>
      <cell title="修改密码" is-link @click.native="lineTo('change-password')"></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell, XHeader } from "vux";
export default {
  data() {
    return {};
  },
  methods: {
    lineTo(path) {
      this.$router.push(path);
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'));
    }
  },
  components: {
    Group,
    Cell,
    XHeader
  }
};
</script>

<style scoped>
.own-info{
  background-color: #f5f5f5;
}
</style>
