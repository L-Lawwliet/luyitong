<template>
  <div class="sell">
    <x-header :left-options="{showBack: false}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">出售
        <a class="add-btn" @click="add">
          <i class="iconfont icon-fabu"></i>
        </a>
      </div>
    </x-header>
    <div class="sell-wrapper">
      <scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :loadText="loadText">
        <el-row class="sell-item-wrapper" v-for="item in goods" :key="item.id">
          <el-row>
            <el-col :span="12" class="name">{{item.PRODUCT_NAME}}</el-col>
            <el-col :span="12" class="time ta-r">{{fmtDate(item.RELEASE_TIME)}}</el-col>
          </el-row>
          <el-row class="order">订单号：{{item.ORDER_NO}}</el-row>
          <el-row>
            <el-col :span="12">
              <p class="order">数量：{{item.PRODUCT_NUM}}</p>
              <p class="money">￥：{{item.PRODUCT_VALUE}}</p>
            </el-col>
            <el-col :span="12" class="ta-r">
              <x-button type="primary" :mini="true" class="btn" @click.native="showDialog=true">立即购买</x-button>
            </el-col>
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

    <!-- 发布商品 -->
    <div v-transfer-dom>
      <x-dialog v-model="showAdd" hide-on-blur @on-show="code=''">
        <div class="dialog-content ta-c">
          <div class="dialog-title">发布商品</div>
          <div class="dialog-mark">请输入商品获取码</div>
          <x-input v-model="code" placeholder="请输入商品获取码">
            <a slot="right" class="add-btn" @click="getOrders">获取</a>
          </x-input>
          <div class="order-goods" v-show="orderGoods.length>0">
            <div v-for="item in orderGoods" :key="item.id">
              <el-col :span="12">{{item.PRODUCT_NAME}}</el-col>
              <el-col :span="12">{{item.PRODUCT_NUM}}</el-col>
            </div>
          </div>
          <div v-if="tips" class="tips">{{tips}}</div>
          <!-- <div class="remarks">备注：发布商品需1个积分，发布成功后系统将自动扣除</div> -->
        </div>
        <div class="dialog-footer">
          <el-col :span="12" @click.native="showAdd=false">
            <a>取消</a>
          </el-col>
          <el-col :span="12" style="border-left:1px solid #ccc;">
            <a class="primary" @click="getGoods">确定</a>
          </el-col>
        </div>
      </x-dialog>
    </div>

    <!-- 联系客服 -->
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" hide-on-blur>
        <div class="dialog-content">
          <div class="dialog-title">请联系客服购买</div>
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
import api from './../../api/api.js';
import { XHeader, XDialog, XInput, XButton, Loading } from "vux";
import scroll from './../../components/scroll';
export default {
  data() {
    return {
      goods: [],
      pageSize: 20,
      pageIndex: 1,
      loadText: '',
      showAdd: false,
      code: "",
      orderGoods: [],
      tips: "",
      loading: false,
      showDialog: false,
    };
  },
  mounted() {
    this.getSellProducts();
  },
  methods: {
    getSellProducts(callback) {
      let params = {
        showCount: this.pageSize,
        currentPage: this.pageIndex
      };
      this.loading = true;
      api.getSellProducts(params).then(res => {
        this.loading = false;
        this.loadText = '';
        if (callback) callback();
        if (res.data.msg_code === 'success') {
          if (this.pageIndex === 1) {
            this.goods = res.data.result;
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
      this.getSellProducts(callback);
    },
    onInfinite(callback) {
      this.loadText = '加载中';
      this.pageIndex++;
      this.getSellProducts(callback);
    },
    onCopy(){
      this.$message({
        type: 'success',
        message: '复制成功！'
      })
    },
    add() {
      this.tips = '';
      this.code = '';
      this.orderGoods = [];
      this.showAdd = true;
    },
    getGoods() {
      if (this.code === '') return this.tips = '请获取商品';
      api.release({ CODE: this.code }).then(res => {
        if (res.data.msg_code === 'success') {
          this.getSellProducts();
          this.showAdd = false;
        } else {
          this.tips = res.data.msg;
        }
      });
    },
    getOrders() {
      if (this.code === '') return this.tips = '请输入识别码';
      this.orderGoods = [];
      api.getOrders({ CODE: this.code }).then(res => {
        if (res.data && res.data.result) {
          this.tips = '';
          this.orderGoods = res.data.result;
        } else {
          this.tips = '没有商品';
        }
      });
    }
  },
  components: {
    XHeader,
    XButton,
    XInput,
    XDialog,
    Loading,
    scroll
  }
};
</script>

<style scoped>
.sell .sell-wrapper {
  padding: 0.6em 0.8em;
  height: calc(100% - 6.6em);
  overflow: auto;
  background: url("./../../assets/img/back.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
}
.add-btn {
  color: #e66456;
  float: right;
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
.sell-item-wrapper {
  position: relative;
  margin-top: 0.4em;
  margin-bottom: 0.6em;
  padding: 0.8em;
  background-color: #fff;
  border-radius: 8px;
}
.name {
  font-family: "PingFang-SC-Bold";
  font-weight: bold;
  font-size: 1em;
  color: #000;
}
.time {
  font-family: "PingFang-SC-Medium";
  color: #999;
  font-size: 1em;
}
.order {
  font-family: "PingFang-SC-Medium";
  color: #999;
  font-size: 1em;
}
.money {
  font-family: "PingFang-SC-Heavy";
  font-size: 1em;
  color: #e66456;
}
.btn {
  margin-top: 1em;
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
.dialog-remarks{
  font-family: 'PingFang-SC-Medium';
  font-size: 0.6em;
  color: #666;
  /* margin-top: -0.5em; */
}
.dialog-qq{
  font-family: 'PingFang-SC-Medium';
  font-size: 1em;
  color: #333;
  padding-top: 0.5em;
}
.order-goods {
  padding: 1em 0;
}
.tips {
  margin-top: 1em;
  color: red;
}
.primary {
  color: #e66456;
}
</style>
