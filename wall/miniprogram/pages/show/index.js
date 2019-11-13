// pages/show/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-0','demo-text-1', 'demo-text-2', 'demo-text-3', 'demo-text-4', 'demo-text-5', 'demo-text-6'],
    cateItem: ['全部', '竞赛', '拼车', '失物招领', '二手转卖', '咨询求助', '吐槽'],
    type: ['未分类', '竞赛', '拼车', '失物招领', '二手转卖', '咨询求助', '吐槽'],
    cateIndex: 0,
    pageNum: 1,
    msgItem:[]
  },

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

  getCateList: function (id) {
    let _this = this;
    let {pageNum} = this.data;
    let {msgItem} = this.data;
    if(id === 0) {
      wx.request({
        url: 'https://oyoungy.cn:8443/wall/posting/pageNumListPostings?pageNum=' + pageNum  +'&pageSize=10',
        method: 'GET',
        header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
        success(res) {
          if (res.data.code === 200) {
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
            console.log('请求失败！' + res.errMsg);
          }
        }
      })
    } else {
      wx.request({
        url: 'https://oyoungy.cn:8443/wall/posting/pageNumListPostingsByCateId?cateId=' + id + '&pageNum=' + pageNum +'&pageSize=10',
        method: 'GET',
        header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
        success(res) {
          if (res.data.code === 200) {
            const list = res.data.data.list.map(item => {
              item.clickTimes = item.clickTimes ? item.clickTimes : 0;
              item.releaseTime = _this.timeChange(item.releaseTime);
              return item;
            })
            _this.setData({
              msgItem: list,
              pageNum: pageNum++
            })
          } else {
            _this.setData({
              msgItem: []
            })
            console.log('请求失败！' + res.errMsg);
          }
        }
      })
    }
  },

  handleItemClick: function(e) {
    const {msgItem} = this.data;
    const {index} = e.currentTarget.dataset;
    const postMessage = {
      id: e.target.id,
      theme: msgItem[index].theme,
      briefIntroduction: msgItem[index].briefIntroduction,
      categoryId: msgItem[index].categoryId,
      clickTimes: msgItem[index].clickTimes,
      posterId: msgItem[index].posterId,
      releaseTime: msgItem[index].releaseTime
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
      pageNum: 0,
      msgItem: []
    }, () => _this.getCateList(e.target.id))
    // this.getCateList(e.target.id);
  },
  /**
   * 滑动切换类名
   */
  handleCateChange: function(e) {
    let _this = this;
    this.setData({
      cateIndex: e.detail.current,
      pageNum: 0,
      msgItem: []
    }, () => _this.getCateList(e.detail.current))
    // this.getCateList(e.detail.current);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {cateIndex} = this.data;
    this.getCateList(cateIndex);
    // let _this = this;
    // wx.request({
    //   url: 'https://oyoungy.cn:8443/wall/posting/pageNumListPostings?pageNum=1&pageSize=10',
    //   method: 'GET',
    //   header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
    //   success(res) {
    //     if (res.data.code === 200) {
    //       const list = res.data.data.list.map(item => {
    //         item.clickTimes = item.clickTimes ? item.clickTimes : 0;
    //         item.releaseTime = _this.timeChange(item.releaseTime);
    //         return item;
    //       })
    //       _this.setData({
    //         msgItem: list,
    //         pageNum: ++_this.data.pageNum
    //       })
    //     } else {
    //       console.log('请求失败！' + res.errMsg);
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
      const { msgItem } = this.data;
      const {cateIndex} = this.data;
      this.getCateList(cateIndex);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})