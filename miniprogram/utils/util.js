function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function showToast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 2000 })
}

function showLoading(title = '加载中...') {
  wx.showLoading({ title })
}

function hideLoading() {
  wx.hideLoading()
}

module.exports = {
  formatDate,
  showToast,
  showLoading,
  hideLoading
}
