var app = getApp();
Component({
  data: {
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      "pagePath": "../../pages/show/index",
      "text": "墙",
      "selectedIconPath": "../common/image/ikun.jpg",
      "iconPath": "../common/image/ikun.jpg"
    },
    {
      "pagePath": "../../pages/publish/index",
      "text": "发布",
      "selectedIconPath": "../common/image/ikun.jpg",
      "iconPath": "../common/image/ikun.jpg"
    },
    {
      "pagePath": "../../pages/user/index",
      "text": "我",
      "selectedIconPath": "../common/image/ikun.jpg",
      "iconPath": "../common/image/ikun.jpg"
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