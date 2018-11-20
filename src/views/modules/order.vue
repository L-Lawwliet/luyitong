<template>
  <div class="order">
    <x-header :left-options="{showBack: false}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">订单</div>
    </x-header>
    <div class="order-wrapper">
      <scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loadText="loadText" tipColor="#fff">
        <el-row class="order-item-wrapper" v-for="item in goods" :key="item.id">
          <el-row class="header">
            <el-col :span="12" class="order-num">
              <span>订单ID：{{item.PRODUCT_ID}}</span>
            </el-col>
            <el-col :span="12" class="primary">
              <span v-if="item.STATUS==='0'">未发布</span>
              <span v-if="item.STATUS==='1'">已发布</span>
              <span v-if="item.STATUS==='3'">已完成</span>
            </el-col>
          </el-row>
          <el-row class="name">{{item.PRODUCT_NAME}}</el-row>
          <el-row>
            <el-col :span="12">
              <p class="count">数量：{{item.PRODUCT_NUM}}</p>
              <p class="count">{{fmtDate(item.RELEASE_TIME)}}</p>
            </el-col>
            <el-col :span="12" class="ta-r total">合计：￥{{item.PRODUCT_VALUE*item.PRODUCT_NUM}}</el-col>
          </el-row>
        </el-row>
        <div v-if="!loading&&goods.length===0" class="empty">
          <i class="iconfont icon-zanwushuju"></i>
          <div class="text">暂无相关数据</div>
        </div>
      </scroll>
      <div v-transfer-dom>
        <loading :show="loading" text=""></loading>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './../../api/api.js';
  import {
    XHeader,
    Loading
  } from "vux";
  import scroll from './../../components/scroll';
  export default {
    data() {
      return {
        goods: [],
        pageSize: 20,
        pageIndex: 1,
        loadText: '',
        loading: false,
        noData: false
      };
    },
    mounted() {
      this.getMyOrders();
    },
    methods: {
      getMyOrders(callback) {
        let params = {
          showCount: this.pageSize,
          currentPage: this.pageIndex
        };
        this.loading = true;
        api.getMyOrders(params).then(res => {
          this.loading = false;
          this.loadText = '';
          if (callback) callback();
          if (res.data.msg_code === 'success') {
            this.noData = false;
            if (this.pageIndex === 1) {
              this.goods = res.data.result;
            } else if (res.data.result.length === 0) {
              this.noData = true;
              this.$message({
                type: 'info',
                message: '没有更多了'
              })
            } else {
              this.goods = this.goods.concat(res.data.result);
            }
          } else {
            this.$message({
              type: 'info',
              message: res.data.msg
            })
            this.goods = [];
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
      onRefresh(callback) {
        this.getMyOrders(callback);
      },
      onInfinite(callback) {
        this.loadText = '加载中';
        if (this.loading || this.noData) return;
        this.pageIndex++;
        this.getMyOrders(callback);
      }
    },
    components: {
      XHeader,
      Loading,
      scroll
    }
  };

</script>

<style scoped>
  .order .order-wrapper {
    padding: 0.6em 0.8em;
    height: calc(100% - 6.6em);
    overflow: auto;
    background: url("./../../assets/img/back.jpg");
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .order-item-wrapper {
    margin-bottom: 1em;
    padding: 0.5em 1em;
    background-color: #fff;
  }

  .primary {
    color: #e66456;
    text-align: right;
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
  }

  .empty {
    text-align: center;
    color: #666;
    margin-top: 4em;
  }

  .empty .icon-zanwushuju {
    font-size: 7em;
    margin-left: 0.2em;
    color: #fff;
  }

  .empty .text {
    margin-top: -1.5em;
    color: #fff;
  }

  .order-item-wrapper {
    margin-top: 0.4em;
    margin-bottom: 0.6em;
    padding: 0.8em;
    background-color: #fff;
    border-radius: 8px;
  }

  .header {
    height: 2em;
    border-bottom: 1px solid #e6e6e6;
  }

  .order-num {
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
    color: #333;
  }

  .name {
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
    color: #000;
    margin-top: 0.4em;
    margin-bottom: 0.6em;
  }

  .count {
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
    color: #999;
  }

  .total {
    font-family: "PingFang-SC-Medium";
    font-size: 1em;
    color: #000;
    margin-top: 1.4em;
  }

</style>
