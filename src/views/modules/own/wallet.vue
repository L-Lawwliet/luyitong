<template>
  <div class="wallet">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">钱包</div>
    </x-header>
    <div v-transfer-dom>
      <alert v-model="showTips" title="提示"> {{tips}}</alert>
    </div>
    <group class="content">
      <cell title="余额" is-link @click.native="linkTo('balance')">
        <div class="value">{{cash}}元</div>
      </cell>
      <cell title="银行卡" is-link @click.native="getMyWallet('1')"></cell>
      <cell title="BTC地址" is-link @click.native="getMyWallet('2')"></cell>
      <cell title="支付宝账号" is-link @click.native="getMyWallet('3')"></cell>
    </group>

    <div v-transfer-dom>
      <x-dialog v-model="showDialog" hide-on-blur>
        <div class="dialog-content">
          <div class="dialog-title" v-if="type==='1'">银行卡</div>
          <div class="dialog-title" v-if="type==='2'">BTC</div>
          <div class="dialog-title" v-if="type==='3'">支付宝</div>
          <div class="dialog-mark" v-if="oldAccount">
            <span>原账户</span>
            <span style="color:#333;margin-left:0.5em">{{oldAccount}}</span>
          </div>
          <div class="dialog-mark">账户</div>
          <x-input v-model="account" placeholder="请输入账户"></x-input>
          <div class="dialog-mark" v-if="type!=='2'">账户名</div>
          <x-input v-model="accountName" placeholder="请输入账户名" v-if="type!=='2'"></x-input>
          <div class="dialog-mark" v-if="type==='1'">开户银行</div>
          <x-input v-model="bank" placeholder="请输入开户银行" v-if="type==='1'"></x-input>
          <div class="warming">{{warmTips}}</div>
          <div class="remarks">备注：每个账户只能添加一个，可修改不可删除</div>
        </div>
        <div class="dialog-footer">
          <el-col :span="12" @click.native="showDialog=false">
            <a>取消</a>
          </el-col>
          <el-col :span="12" style="border-left:1px solid #ccc;">
            <a class="primary" v-if="!isEdit" @click="addAccount">确定</a>
            <a class="primary" v-if="isEdit" @click="editAccount">确定</a>
          </el-col>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import api from './../../../api/api.js';
  import {
    Group,
    Cell,
    XHeader,
    XInput,
    XDialog,
    Alert
  } from "vux";
  export default {
    data() {
      return {
        type: '1',
        accounts: [],
        showDialog: false,
        oldAccount: '',
        account: '',
        accountName: '',
        isEdit: false,
        tips: '',
        showTips: false,
        cash: 0,
        warmTips: '',
        bank: ''
      };
    },
    mounted() {
      this.getCashValue();
    },
    methods: {
      linkTo(path) {
        this.$router.push(path);
      },
      getCashValue() {
        api.getCashValue().then(res => {
          if (res.data.msg_code === 'success') {
            this.cash = res.data.result;
          }
        })
      },
      getMyWallet(type) {
        this.warmTips = '';
        this.type = type;
        api.getMyWallet().then(res => {
          if (res.data.msg_code === 'success') {
            this.accounts = res.data.result.filter(item => {
              return item.TYPE === type;
            });
            if (this.accounts.length > 0) {
              this.isEdit = true;
              this.account = '';
              this.oldAccount = this.accounts[0].ACCOUNT;
              this.accountName = this.accounts[0].ACCOUNT_NAME;
              this.bank = this.accounts[0].BANK_NAME;
            } else {
              this.isEdit = false;
              this.oldAccount = '';
              this.accountName = '';
              this.account = '';
              this.bank = '';
            }
            this.showDialog = true;
          } else {
            this.$message({
              type: 'info',
              message: res.data.msg
            })
          }
        })
      },
      addAccount() {
        if (this.account === '') {
          this.warmTips = '请输入账户';
          this.$forceUpdate();
          return;
        }
        if (this.accountName === '' && this.type !== '2') {
          this.warmTips = '请输入账户名';
          this.$forceUpdate();
          return;
        }
        if (this.bank === '' && this.type === '1') {
          this.warmTips = '请输入开户银行';
          this.$forceUpdate();
          return;
        }
        let params = {
          ACCOUNT: this.account,
          ACCOUNT_NAME: this.accountName,
          TYPE: this.type
        };
        if (this.type === 1) {
          params.BANK_NAME = this.bank;
        }
        api.addAccount(params).then(res => {
          if (res.data.msg_code === 'success') {
            this.showTips = true;
            this.tips = res.data.msg;
            setTimeout(() => {
              this.showTips = false;
            }, 2000);
            this.showDialog = false;
          } else {
            this.showTips = true;
            this.tips = res.data.msg;
          }
        })
      },
      editAccount() {
        if (this.account === '') {
          this.warmTips = '请输入账户';
          this.$forceUpdate();
          return;
        }
        if (this.accountName === '' && this.type !== '2') {
          this.warmTips = '请输入账户名';
          this.$forceUpdate();
          return;
        }
        if (this.bank === '' && this.type === '1') {
          this.warmTips = '请输入开户银行';
          this.$forceUpdate();
          return;
        }
        this.warmTips = '';
        let item = this.accounts[0];
        let params = {
          OLDACCOUNT: this.oldAccount,
          ACCOUNT: this.account,
          ACCOUNT_NAME: this.accountName,
          TYPE: this.type,
          ID: item.ID
        };
        if (this.type === 1) {
          params.BANK_NAME = this.bank;
        }
        api.editAccount(params).then(res => {
          if (res.data.msg_code === 'success') {
            this.showTips = true;
            this.tips = res.data.msg;
            setTimeout(() => {
              this.showTips = false;
            }, 2000);
            this.showDialog = false;
          } else {
            this.showDialog = false;
            this.showTips = true;
            this.tips = res.data.msg;
          }
        })
      },
      delAccount(item) {
        api.delAccount({
          ID: item.USER_ID
        }).then(res => {
          if (res.data.msg_code === 'success') {
            this.showTips = true;
            this.tips = res.data.msg;
            setTimeout(() => {
              this.showTips = false;
            }, 2000);
            this.showDialog = false;
          } else {
            this.showTips = true;
            this.tips = res.data.msg;
          }
        })
      }
    },
    components: {
      Group,
      Cell,
      XHeader,
      XInput,
      XDialog,
      Alert
    }
  };

</script>

<style scoped>
  .wallet {
    background-color: #f5f5f5;
  }

  .content {
    margin-top: 0.6em;
    background-color: #fff;
  }

  .content .value {
    color: #e66456;
    margin-right: 0.5em;
  }

  .dialog-content {
    padding: 1em 1.2em;
  }

  .dialog-title {
    font-family: "PingFang-SC-Bold";
    font-size: 1em;
    color: #333;
  }

  .dialog-mark {
    text-align: left;
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
    color: #999;
    margin-top: 0.125em;
    margin-bottom: 0.8em;
  }

  .dialog-content .weui-cell {
    border-radius: 6px;
    background-color: #f5f5f5;
    border: 1px solid #e5e5e5;
    padding: 0.5em 1em;
  }

  .dialog-content .weui-cell:before {
    border-top: 0 !important;
  }

  .dialog-content .remarks {
    margin-top: 1em;
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
    color: #808080;
    text-align: left;
  }

  .dialog-footer {
    border-top: 1px solid #ccc;
    height: 3.6em;
    line-height: 3.6em;
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
  }

  .primary {
    color: #e66456;
  }

  .warming {
    margin-top: 0.5em;
    color: red;
  }

</style>
