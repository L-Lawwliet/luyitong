<template>
  <div class="share">
    <x-header :left-options="{backText: ''}" style="background-color:#fff;">
      <div class="overwrite-title" slot="overwrite-title">分享</div>
    </x-header>
    <div class="share-wrapper">
      <scroll :on-refresh="onRefresh">
        <div class="share-invite">我的邀请码：{{inviteCode}}</div>
        <el-row class="share-content">
          <el-col :span="12" class="ta-c">
            <div class="share-content-title">累计收益（元）</div>
            <div class="share-content-number">{{profit}}</div>
            <x-button type="primary" class="share-content-btn" @click.native="turnWallet">转到钱包</x-button>
          </el-col>
          <el-col :span="12" class="ta-c">
            <div class="share-content-title">积分（个）</div>
            <div class="share-content-number">{{integral}}</div>
            <x-button type="primary" class="share-content-btn" @click.native="showExchange=true">兑换</x-button>
            <div class="share-content-remarks">1个积分可兑换3元</div>
          </el-col>
        </el-row>
        <group>
          <cell title="分享" @click.native="linkTo('extension')" is-link>
            <div class="share-share">
              好友注册即送<span>3元</span>红包
            </div>
          </cell>
        </group>
        <group class="friends">
          <div class="share-friends-title">好友明细</div>
          <div v-for="(friend, index) in friendRecord" :key="friend.id">
            <cell :title="friend.userName" is-link :border-intent="false" :arrow-direction="friend.expand ? 'up' : 'down'"
              @click.native="friendClick(index)">
              <i slot="icon" class="iconfont icon-touxiang-"></i>
            </cell>
            <div class="slide" :class="friend.expand?'animate':''">
              <el-row class="share-friends-item" v-for="item in friend.data" :key="item.id">
                <el-col :span="12">{{fmtDate(item.updatedatetime)}}</el-col>
                <el-col :span="12" class="ta-r">
                    <div>{{item.title}}</div> 
                    <div>{{item.changeWorth>0?'+'+item.changeWorth:item.changeWorth}}{{item.type==='2'?'积分':'元'}}</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </group>
      </scroll>
    </div>

    <div v-transfer-dom>
      <alert v-model="show" title="提示"> {{tips}}</alert>
    </div>

    <div v-transfer-dom>
      <confirm v-model="showExchange" title="提示" @on-confirm="exchange">
        <p style="text-align:center;">确定要将积分兑换成现金？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
    import api from './../../../api/api.js';
    import {
        Group,
        Cell,
        XHeader,
        XButton,
        Alert,
        Confirm
    } from "vux";
    import scroll from './../../../components/scroll';
    export default {
        data() {
            return {
                inviteCode: '',
                profit: 0,
                integral: 0,
                tips: '',
                show: false,
                showExchange: false,
                friendRecord: [],
            };
        },
        mounted() {
            this.getInviteCode();
            this.getAssets();
            this.myFriendRecord();
        },
        methods: {
            onRefresh(callback) {
                this.getInviteCode();
                this.getAssets();
                this.myFriendRecord();
                callback();
            },
            linkTo(path) {
                this.$router.push(path);
            },
            getInviteCode() {
                api.getInviteCode().then(res => {
                    if (res.data.msg_code === 'success') {
                        this.inviteCode = res.data.result;
                    }
                })
            },
            getAssets() {
                api.getAssets().then(res => {
                    if (res.data.msg_code === 'success') {
                        this.profit = res.data.result.USER_ORD_VALUE;
                        this.integral = res.data.result.SELF_VALUE;
                    }
                })
            },
            turnWallet() {
                if (this.profit === 0) {
                    this.tips = '累计收益不足';
                    this.show = true;
                    setTimeout(() => {
                        this.show = false;
                    }, 2000);
                    return false;
                }
                let userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
                let params = {
                    VALUES: this.profit,
                    ACCOUNT_ID: userId
                };
                api.turnWallet(params).then(res => {
                    this.tips = res.data.msg;
                    this.show = true;
                    this.getAssets();
                    setTimeout(() => {
                        this.show = false;
                    }, 2000);
                })
            },
            exchange() {
                if (this.integral === 0) {
                    this.tips = '积分不足';
                    this.show = true;
                    setTimeout(() => {
                        this.show = false;
                    }, 2000);
                    return false;
                }
                let params = {
                    VALUES: this.integral
                };
                api.exchange(params).then(res => {
                    this.tips = res.data.msg;
                    this.show = true;
                    this.getAssets();
                    setTimeout(() => {
                        this.show = false;
                    }, 2000);
                })
            },
            myFriendRecord() {
                api.myFriendRecord().then(res => {
                    if (res.data.msg_code === 'success') {
                        let arr = res.data.result;
                        if (arr.length > 0) {
                            var map = {};
                            var dest = [];
                            for (var i = 0; i < arr.length; i++) {
                                var ai = arr[i];
                                if (!map[ai.userName]) {
                                    dest.push({
                                        userName: ai.userName,
                                        data: [ai]
                                    });
                                    map[ai.userName] = ai;
                                } else {
                                    for (var j = 0; j < dest.length; j++) {
                                        var dj = dest[j];
                                        if (dj.userName == ai.userName) {
                                            dj.data.push(ai);
                                            break;
                                        }
                                    }
                                }
                            }
                            this.friendRecord = dest;
                            console.log(dest)
                        } else {
                            this.friendRecord = [];
                        }
                    }
                })
            },
            friendClick(i) {
                this.$set(this.friendRecord[i], 'expand', !this.friendRecord[i].expand);
                this.$forceUpdate();
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
            Group,
            Cell,
            XButton,
            XHeader,
            Alert,
            scroll,
            Confirm
        }
    };
</script>

<style scoped>
    .slide {
        padding: 0 1em;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
    }
    
    .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
        background-color: #f5f5f5;
    }
    
    .share {
        height: 100%;
        background-color: #f5f5f5;
    }
    
    .share-wrapper {
        height: calc(100% - 3em);
        overflow: auto;
    }
    
    .share-invite {
        font-size: 1em;
        color: #000;
        padding: 0.5em 1em;
        background-color: #fff;
        /* border-bottom: 1px solid #e6e6e6; */
        margin-top: 0.6em;
    }
    
    .share-content {
        background-color: #fff;
        padding-top: 1.4em;
    }
    
    .share-content-title {
        font-size: 0.8em;
        color: #808080;
    }
    
    .share-content-number {
        font-size: 1.8em;
        color: #e66456;
        line-height: 1.6em;
    }
    
    .share-content-btn {
        margin-top: 0.4em;
        width: 7em;
        height: 2.2em;
        font-size: 1em;
        line-height: 1em;
    }
    
    .share-content-remarks {
        font-size: 1em;
        color: #b3b3b3;
        line-height: 3em;
    }
    
    .share-share {
        font-size: 1em;
    }
    
    .share>>>.weui-cells:before,
    .share>>>.weui-cells:after {
        border-top: 0 !important;
        border-bottom: 0 !important;
    }
    
    .share-share span {
        color: #e66456;
    }
    
    .share-friends-title {
        font-size: 1em;
        color: #e66456;
        padding: 0.5em 1em;
    }
    
    .icon-touxiang- {
        font-size: 2em;
        color: #e5e5e5;
        margin-right: 0.3em;
    }
    
    .share-friends-item {
        font-size: 1em;
        color: #333;
        padding: 0.6em 0 0.6em 0;
        border-bottom: 1px solid #e5e5e5;
    }
</style>