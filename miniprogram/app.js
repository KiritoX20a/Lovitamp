App({
  globalData: {
    userInfo: null,
    isAdmin: false,
    openid: '',
    systemInfo: null
  },
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      },
      fail: (err) => {
        console.error('getSystemInfo failed:', err)
        this.globalData.systemInfo = {
          windowWidth: 375,
          windowHeight: 667
        }
      }
    })
  }
})
