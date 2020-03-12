// pages/show/itemDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ['未分类', '竞赛', '拼车', '失物招领', '二手转卖', '咨询求助', '吐槽'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data);
      let {pageNum, id} = data;
      wx.request({
        url: `https://oyoungy.cn:8443/wall/posting/pageNumListFloorsByPostingId?postingId=${id}&pageNum=${pageNum}&pageSize=10`,
        method: 'GET',
        header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
        success(res) {
          if (res.data.code === 200) {
            // 获取下一页的数据
            let {data} = res.data;
            _this.setData({
              data
            })
          } else {
            _this.setData({
              // msgItem: []
            });
            console.log('请求失败！' + res.errMsg);
          }
        }
      })
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})