const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { stats:{articles:0,media:0,skills:0}, recentArticles:[] },
  onLoad(){ this.loadDashboard() },
  async loadDashboard(){
    util.showLoading()
    try {
      const [ar,mr,sr]=await Promise.all([api.getArticles({page:1,pageSize:1}),api.getMedia({page:1,pageSize:1}),api.getSkills()])
      this.setData({stats:{articles:ar.total||0,media:mr.total||0,skills:(sr.data||[]).length}})
      const rr=await api.getArticles({page:1,pageSize:5})
      this.setData({recentArticles:rr.data||[]})
    } catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  goToArticleEdit(e){ wx.navigateTo({url:"/pages/admin/article-edit?id="+(e.currentTarget.dataset.id||"")}) },
  goToSkillEdit(){ wx.navigateTo({url:"/pages/admin/skill-edit"}) },
  goToMediaEdit(){ wx.navigateTo({url:"/pages/admin/media-edit"}) },
  formatDate(d){ return util.formatDate(d) }
})