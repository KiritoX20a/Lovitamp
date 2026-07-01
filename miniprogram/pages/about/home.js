const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { avatarUrl:"", aboutContent:"", contacts:[], currentTab:"blog", contentList:[], page:1, pageSize:10, hasMore:true, tapCount:0 },
  onLoad(){ this.loadContent() },
  onShow(){ if(typeof this.getTabBar==="function") this.getTabBar().setData({selected:3}) },
  async loadContent(loadMore){
    if(!loadMore){ util.showLoading(); this.setData({page:1,contentList:[]}) }
    try {
      const r = await api.getArticles({type:this.data.currentTab,page:this.data.page,pageSize:this.data.pageSize})
      const nl = loadMore?[...this.data.contentList,...r.data]:r.data
      this.setData({contentList:nl,hasMore:nl.length<r.total})
    } catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  switchTab(e){ this.setData({currentTab:e.currentTarget.dataset.tab},()=>this.loadContent(false)) },
  loadMore(){ this.setData({page:this.data.page+1},()=>this.loadContent(true)) },
  goToDetail(e){ wx.navigateTo({url:"/pages/article/detail?id="+e.currentTarget.dataset.id}) },
  onAvatarTap(){
    let c=this.data.tapCount+1; this.setData({tapCount:c})
    if(c>=5){ this.setData({tapCount:0}); wx.showToast({title:"验证中...",icon:"none"}); this.enterAdmin() }
    clearTimeout(this._tapTimer)
    this._tapTimer=setTimeout(()=>{this.setData({tapCount:0})},3000)
  },
  async enterAdmin(){
    util.showLoading("验证中...")
    try{ const r=await api.checkAdmin(); if(r.isAdmin) wx.navigateTo({url:"/pages/admin/dashboard"}); else util.showToast("无权限 (openid: "+r.openid+")") }
    catch(e){ util.showToast("验证失败") }
    util.hideLoading()
  },
  formatDate(d){ return util.formatDate(d) }
})