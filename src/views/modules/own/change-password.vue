<template>
  <div class="change-password">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">修改密码</div>
    </x-header>
    <div class="tips">请输入旧密码，再输入6~32位大小写英文字符、数字、下划线或组合的新密码</div>
    <group>
      <div class="change-password-form">
        <x-input v-model="oldPassword" placeholder="旧密码" type="password"></x-input>
        <x-input v-model="newPassword" placeholder="新密码" type="password"></x-input>
        <x-input v-model="anp" placeholder="确认新密码" type="password"></x-input>
      </div>
    </group>
    <div class="change-password-btn">
      <x-button type="primary" @click.native="changePassword">保存</x-button>
    </div>
  </div>
</template>

<script>
import api from './../../../api/api.js';
import { XHeader, XInput, XButton, Group } from "vux";
export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      anp: ''
    };
  },
  methods: {
    changePassword(){
      if(this.newPassword !== this.anp){
        this.$message({
          type: 'info',
          message: '两次密码不一致'
        })
        return false;
      }
      let params = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      };
      api.changePassword(params).then(res=>{
        if(res.data.msg_code === 'success'){
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }else{
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
.change-password {
  background-color: #f5f5f5;
}
.tips {
  color: #b3b3b3;
  font-size: 1em;
  padding: 0.5em 1.2em;
}
.change-password-btn {
  margin-top: 2.4em;
  padding: 0 2.4em;
}
.primary {
  color: #e66456;
  float: right;
}
.change-password >>> .weui-cells:before,
.change-password >>> .weui-cells:after {
  border-top: 0 !important;
  border-bottom: 0 !important;
}
.change-password >>> .weui-cell:before {
  border-top: 0 !important;
  border-bottom: 1px solid #d9d9d9 !important;
}
</style>
