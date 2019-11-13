// pages/user/published/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    postingId: 0,
    buttons: [{ text: '取消' }, { text: '确定' }],
    type: ['未分类', '竞赛', '拼车', '失物招领', '二手转卖', '咨询求助', '吐槽'],
    msgItem: []
  },

  timeChange: function (num) {//时间戳数据处理
    let date = new Date(num * 1000);
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    M = M < 10 ? ('0' + M) : M;//月补0
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;//天补0
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;//小时补0
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;//分钟补0
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;//秒补0
    return Y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'https://oyoungy.cn:8443/wall/userCenter/posting',
      method: 'GET',
      header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
      data: {
        pageSize: 10,
        pageNum: 1
      },
      success(res) {
        console.log(res);
        if (res.data.code === 200) {
          const list = res.data.data.list.map(item => {
            item.clickTimes = item.clickTimes ? item.clickTimes : 0;
            item.releaseTime = _this.timeChange(item.releaseTime);
            return item;
          })
          _this.setData({
            msgItem: list
          })
        } else {
          console.log('请求失败！' + res.errMsg);
        }
      }
    })
  },

  handleItemPress: function(e) {
    console.log(e);
    this.setData({
      dialogShow: true,
      postingId: parseInt(e.currentTarget.id)
    })
  },

  handleItemEdit: function(e) {
    console.log(e);
    let _this = this;
    wx.navigateTo({
      url: './edit/index',
      events: {
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        const index = e.target.dataset.index;
        const {msgItem} = _this.data;
        console.log(msgItem);
        const postMessage = {
          theme: msgItem[index].theme,
          categoryId: msgItem[index].categoryId,
          postingId: msgItem[index].id,
          detailedIntroduction: msgItem[index].briefIntroduction,
          pictureIntroduction: ""
        }
        res.eventChannel.emit('acceptDataFromOpenerPage', postMessage);
      }
    })
  },

  tapDialogButton(e) {
    let _this = this;
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
    if(e.detail.index === 1) {
      wx.request({
        url: 'https://oyoungy.cn:8443/wall/userCenter/posting?postingId=' + _this.data.postingId,
        method: 'DELETE',
        header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
        data: {
          postingId: _this.data.postingId
        },
        success(res) {
          if (res.data.code === 200) {
            wx.request({
              url: 'https://oyoungy.cn:8443/wall/userCenter/posting',
              method: 'GET',
              header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
              data: {
                pageSize: 10,
                pageNum: 1
              },
              success(res) {
                console.log(123,res);
                if (res.data.code === 200) {
                  const list = res.data.data.list.map(item => {
                    item.clickTimes = item.clickTimes ? item.clickTimes : 0;
                    item.releaseTime = _this.timeChange(item.releaseTime);
                    return item;
                  })
                  _this.setData({
                    msgItem: list
                  })
                } else {
                  console.log('请求失败！' + res.errMsg);
                }
              }
            })
            wx.showToast({
              title: '删除成功'
            })
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
            console.log('请求失败！' + res.errMsg);
          }
        }
      })
    }
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
    let _this = this;
    wx.request({
      url: 'https://oyoungy.cn:8443/wall/userCenter/posting',
      method: 'GET',
      header: { 'Authorization': "Bearer " + wx.getStorageSync('token') },
      data: {
        pageSize: 10,
        pageNum: 1
      },
      success(res) {
        console.log(res);
        if (res.data.code === 200) {
          const list = res.data.data.list.map(item => {
            item.clickTimes = item.clickTimes ? item.clickTimes : 0;
            item.releaseTime = _this.timeChange(item.releaseTime);
            return item;
          })
          _this.setData({
            msgItem: list
          })
        } else {
          console.log('请求失败！' + res.errMsg);
        }
      }
    })
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