const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { avatarUrl: "", nickname: "你的名字", bio: "AI / 摄影 / 户外 / 一切有趣的事情", socialLinks: [], carouselItems: [], latestArticles: [] },
  onLoad() { this.loadData() },
  onShow() { if(typeof this.getTabBar==="function") this.getTabBar().setData({selected:0}) },
  async loadData() {
    util.showLoading()
    try { const r=await api.getArticles({page:1,pageSize:3}); this.setData({latestArticles:r.data}) } catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  goToArticle(e) { wx.navigateTo({url:"/pages/article/detail?id="+e.currentTarget.dataset.id}) },
  formatDate(d){ return util.formatDate(d) }
})