import http from './../util/http';

// let lyt = '/lyt';
let lyt = '';
class api {
  constructor() {};
  // 用户登录
  login(params) {
    return http.post(`${lyt}/applogin/login.do`, params);
  };
  // 获取短信验证码
  getCodeForPhone(params) {
    return http.post(`${lyt}/head/getCodeForPhone.do`, params);
  };
  // 用户注册
  register(params) {
    return http.post(`${lyt}/user/userRegister.do`, params);
  };
  // 用户密码修改
  changePassword(params) {
    return http.post(`${lyt}/user/updatePwd`, params);
  };
  // 分享二维码
  getShareQRcode(params) {
    return http.get(`${lyt}/user/getShareQRcode.do`, params);
  };
  // 获取用户信息
  getUserInfo(params) {
    return http.get(`${lyt}/user/getUserInfo.do`, params);
  };
  // 忘记密码
  forgetPassword(params) {
    return http.post(`${lyt}/applogin/forgetPwd.do`, params);
  };
  // 发布商品
  release(params) {
    return http.post(`${lyt}/product/release.do`, params);
  };
  // 获取出售商品
  getSellProducts(params) {
    return http.post(`${lyt}/product/getSellProducts.do`, params);
  };
  // 获取订单商品
  getMyOrders(params) {
    return http.post(`${lyt}/product/getMyOrders.do`, params);
  };
  // 根据发布码获取订单商品接口
  getOrders(params) {
    return http.post(`${lyt}/product/getOrders.do`, params);
  };
  // 退出登录
  loginOut(params) {
    return http.post(`${lyt}/applogin/sys_out.do`, params);
  };
  // 添加账户
  addAccount(params) {
    return http.post(`${lyt}/wallet/save.do`, params);
  };
  // 修改账户
  editAccount(params) {
    return http.post(`${lyt}/wallet/edit.do`, params);
  };
  // 删除账户
  delAccount(params) {
    return http.post(`${lyt}/wallet/delete.do`, params);
  };
  // 获取我的账户
  getMyWallet(params) {
    return http.get(`${lyt}/wallet/getMyWallet.do`, params);
  };
  // 获取钱包余额
  getCashValue(params) {
    return http.get(`${lyt}/wallet/getCashValue.do`, params);
  };
  // 提现
  withdraw(params) {
    return http.post(`${lyt}/wallet/withdraw.do`, params);
  };
  // 收支明细
  record(params) {
    return http.post(`${lyt}/wallet/record.do`, params);
  };
  // 我的邀请码
  getInviteCode(params) {
    return http.get(`${lyt}/user/getInviteCode.do`, params);
  };
  // 累计收益、积分
  getAssets(params) {
    return http.get(`${lyt}/wallet/getAssets.do`, params);
  };
  // 收益转到钱包
  turnWallet(params) {
    return http.post(`${lyt}/wallet/turnWallet.do`, params);
  };
  // 积分兑换
  exchange(params) {
    return http.post(`${lyt}/wallet/exchange.do`, params);
  };
  // 好友明细
  myFriendRecord(params) {
    return http.post(`${lyt}/wallet/myFriendRecord.do`, params);
  };
}

export default new api;
