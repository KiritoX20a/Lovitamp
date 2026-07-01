App({
  globalData: {
    userInfo: null,
    isAdmin: false,
    openid: ''
  },
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })
  }
})
