// pages/show/index.js
const createRecycleContext = require('../../common/miniprogram-recycle-view/src/index.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-0','demo-text-1', 'demo-text-2', 'demo-text-3', 'demo-text-4', 'demo-text-5', 'demo-text-6'],
    cateItem: ['全部', '竞赛', '拼车', '失物招领', '二手转卖', '咨询求助', '吐槽'],
    type: ['未分类', '竞赛', '拼车', '失物招领', '二手转卖', '咨询求助', '吐槽'],
    cateIndex: 0, // 类型序号
    pageNum: 1,
    msgItem: [], // 信息数组
    appendList: [], // 滑到窗口底部添加的信息数组
    isNavigationTop: false
  },

   /**
   * 将时间戳转化成日期
   */

  timeChange: function (num) {//时间戳数据处理
    let date = new Date(num * 1000);
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    M = M < 10 ? ('0' + M) : M;//月补0
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;//天补0
    return Y + '-' + M + '-' + d;
  },

   /**
   * 根据id返回不同的数据请求url
   */

  getListUrl: function(id, pageNum) {
    if (id === 0) {
      return `https://oyoungy.cn:8443/wall/posting/pageNumListPostings?pageNum=${pageNum}&pageSize=10`; // 获取全部信息
    } else {
      return `https://oyoungy.cn:8443/wall/posting/pageNumListPostingsByCateId?cateId=${id}&pageNum=${pageNum}&pageSize=10` // 根据类别获取信息
    }
  },

  getAppendList: function (id) {
    let _this = this;
    let { msgItem, pageNum } = this.data;
    wx.request({
      url: _this.getListUrl(id, pageNum),
      method: 'GET',
      header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
      success(res) {
        if (res.data.code === 200) {
          // 获取下一页的数据
          let appendList = res.data.data.list.map(item => {
            item.clickTimes = item.clickTimes ? item.clickTimes : 0;
            item.releaseTime = _this.timeChange(item.releaseTime);
            return item;
          })
          _this.setData({
            appendList: appendList ? appendList : [],
            pageNum: ++pageNum
          })
        } else {
          _this.setData({
            msgItem: []
          });
          console.log('请求失败！' + res.errMsg);
        }
      }
    })
  },

  getCateList: function (id) {
    let _this = this;
    let {msgItem, pageNum} = this.data;
    wx.request({
      url: _this.getListUrl(id, 1),
      method: 'GET',
      header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
      success(res) {
        if (res.data.code === 200) {
          // 获取下一页的数据
          const list = res.data.data.list.map(item => {
            item.clickTimes = item.clickTimes ? item.clickTimes : 0;
            item.releaseTime = _this.timeChange(item.releaseTime);
            return item;
          })
          _this.setData({
            msgItem: msgItem.concat(list),
            pageNum: ++pageNum
          })
        } else {
          _this.setData({
            msgItem: []
          });
          console.log('请求失败！' + res.errMsg);
        }
      }
    })
  },

  getNavigationDom: function() {
    const _this = this;
    const navigationDom = this.createSelectorQuery().select('#navigation').boundingClientRect(function (rect) {
      _this.setData({
        isNavigationTop: rect.top <=0
      });
    });
    return function(){
      navigationDom.exec();
    }
  },

  /**
   * 滑动窗口
   */

  handleTouchMove: function(e) {
    this.getNavigationDom()();
  },

  /**
 * 点击信息
 */

  handleItemClick: function(e) {
    const {pageNum} = this.data;
    console.log(e);
    const {index} = e.currentTarget.dataset;
    const postMessage = {
      id: e.target.id,
      pageNum: pageNum
    }
    wx.navigateTo({
      url: './itemDetail/index',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', postMessage)
      }
    })
  },
  /**
   * 点击类名
   */
  handleClickCate: function (e) {
    let _this = this;
    this.setData({
      cateIndex: parseInt(e.target.id),
      pageNum: 1,
      msgItem: []
    }, () => _this.createList(true))
  },
  /**
   * 滑动切换类名
   */
  handleCateChange: function(e) {
    let _this = this;
    this.setData({
      cateIndex: e.detail.current,
      pageNum: 1,
      msgItem: []
    }, () => _this.getCateList(e.detail.current))
  },

  createList: function(isNew = false) {
    let _this = this;
    let { appendList, cateIndex } = _this.data;
    let ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'recycleList',
      page: this,
      itemSize: {
        width: 308,
        height: 123
      }
    });
    return function() {
      ctx.append(appendList, () => _this.getAppendList(cateIndex));
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {cateIndex} = this.data;
    // this.getCateList(cateIndex);
    this.getAppendList(cateIndex);
    console.log(123123);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.createList()();
    console.log(111, this.data.msgItem, this.data.appendList)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.createList()();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})