Page({
  data: {
    showTopTips: false,
    formData: {
      theme: "",
      categoryId: 0,
      detailedIntroduction: "",
      pictureIntroduction: ""
    },
    type: ['未分类','竞赛','拼车','失物招领','二手转卖','咨询求助','吐槽'],
    rules: [{
      name: 'theme',
      rules: { required: true, message: '标题必填' },
    }]
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  submitForm() {
    // console.log(this.selectComponent('#form').formValidator.models);
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
        wx.showToast({
          title: '标题不能为空!',
          icon: 'none'
        })
      } else {
        let postMessage = this.selectComponent('#form').formValidator.models;
        postMessage.categoryId = parseInt(postMessage.categoryId);
        wx.request({
          url: 'https://oyoungy.cn:8443/wall/userCenter/posting',
          method: 'POST',
          header: { 'Authorization': "Bearer " + wx.getStorageSync('token')},
          data: postMessage,
          success(res) {
            if (res.data.code === 200) {
              wx.showToast({
                title: '提交成功'
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none'
              })
              console.log('提交失败！' + res.errMsg);
            }
          }
        })
      }
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  }
});