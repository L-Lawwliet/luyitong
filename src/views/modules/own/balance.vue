<template>
  <div class="balance">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">余额</div>
    </x-header>
    <div class="balance-wrapper">
      <div class="bg">
        <div class="ta-c">
          <div class="coin">
            <img :src="'./static/img/coin.png'" alt="">
          </div>
          <p class="account-balance">账户余额</p>
          <p class="money">￥{{balance}}</p>
        </div>
        <div class="btn">
          <x-button @click.native="withdraw">提现</x-button>
        </div>
      </div>
      <div class="detail">收支明细</div>
      <group>
        <cell v-for="item in records" :key="item.id" :title="item.title" :inline-desc="fmtDate(item.updatedatetime)" :value="'￥'+item.changeWorth"></cell>
      </group>
    </div>

    <div v-transfer-dom>
      <alert v-model="show" title="提示"> {{tips}}</alert>
    </div>
  </div>
</template>

<script>
import api from './../../../api/api.js';
import { XHeader, Cell, XButton, Group, Alert } from "vux";
export default {
  data() {
    return {
      balance: 0,
      tips: '',
      show: false,
      records: []
    };
  },
  mounted() {
    this.record();
  },
  methods: {
    getCashValue() {
      api.getCashValue().then(res => {
        if (res.data.msg_code === 'success') {
          this.balance = res.data.result;
        }
      })
    },
    withdraw() {
      if (this.balance === 0) {
        this.tips = '余额为0';
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 2000);
        return false;
      }
      let userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
      let params = {
        VALUES: this.balance,
        ACCOUNT_ID: userId
      };
      api.withdraw(params).then(res => {
        this.tips = res.data.msg;
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 2000);
      })
    },
    record(type) {
      api.record({ TYPE: '' }).then(res => {
        if (res.data.msg_code === 'success') {
          this.records = res.data.result;
        }
      })
    },
    fmtDate(obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    },
  },
  components: {
    XHeader,
    Cell,
    XButton,
    Alert,
    Group
  }
};
</script>

<style scoped>
.balance {
  background-color: #f5f5f5;
  height: 100%;
}
.balance-wrapper {
  height: calc(100% - 3em);
  overflow: auto;
}
.bg {
  background: url("./../../../assets/img/back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
}
.coin {
  text-align: center;
  padding: 2em 0 1em 0;
}
.coin img {
  width: 5em;
}
.account-balance {
  font-size: 1em;
  color: #fff;
  margin-top: -0.6em;
}
.money {
  font-size: 2.6em;
  color: #fff;
  margin-bottom: 0.2em;
  margin-left: -0.2em;
}
.btn {
  padding: 0 1.8em;
  padding-bottom: 2em;
}
.detail {
  padding: 0.8em 1.2em;
  background-color: #fff;
  color: #e66456;
}
</style>
