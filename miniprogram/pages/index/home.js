const api = require("../../utils/api")
const util = require("../../utils/util")

Page({
  data: { avatarUrl: "/images/avatar-home.jpeg", nickname: "你的名字", bio: "AI / 摄影 / 户外 / 一切有趣的事情", socialLinks: [], carouselItems: [], latestArticles: [] },
  onLoad() { this.loadData() },
  onShow() {
    if(typeof this.getTabBar==="function") this.getTabBar().setData({selected:0})
    this.loadData()
  },
  async loadData() {
    util.showLoading()
    try {
      const [articleRes, mediaRes] = await Promise.all([
        api.getArticles({page:1,pageSize:3}),
        api.getMedia({page:1,pageSize:6})
      ])
      const carouselItems = (mediaRes.data || [])
        .map(item => item.thumbnailUrl || item.urlTemp || item.thumbnail || item.url)
        .filter(Boolean)
      this.setData({
        latestArticles: articleRes.data || [],
        carouselItems
      })
    } catch(e){
      util.showToast("加载失败")
    }
    util.hideLoading()
  },
  goToArticle(e) { wx.navigateTo({url:"/pages/article/detail?id="+e.currentTarget.dataset.id}) },
  formatDate(d){ return util.formatDate(d) }
})
