var app = getApp();
Component({
  data: {
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      "pagePath": "../../pages/show/index",
      "text": "墙"
    },
    {
      "pagePath": "../../pages/publish/index",
      "text": "发布"
    },
    {
      "pagePath": "../../pages/user/index",
      "text": "我"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      app.globalData.selectedIndex = parseInt(data.index);
      this.setData({
        selected: app.globalData.selectedIndex
      }, () => wx.switchTab({ url }))
      // wx.switchTab({ url });
    }
  },
  ready: function () {
    this.setData({
      selected: app.globalData.selectedIndex
    })
  },
})