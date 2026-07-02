const api = require("../../utils/api")
const util = require("../../utils/util")

Page({
  data: { mediaList: [], categories: ["全部"], currentCategory: "全部", page: 1, pageSize: 20, hasMore: true },
  onLoad(){ this.loadMedia() },
  onShow(){ if(typeof this.getTabBar==="function") this.getTabBar().setData({selected:2}) },
  async loadMedia(loadMore){
    if(!loadMore){ util.showLoading(); this.setData({page:1,mediaList:[]}) }
    try {
      const params = {page:this.data.page,pageSize:this.data.pageSize}
      if(this.data.currentCategory!=="全部") params.category=this.data.currentCategory
      const r = await api.getMedia(params)
      const nl = loadMore?[...this.data.mediaList,...r.data]:r.data
      this.setData({
        mediaList: nl,
        categories: r.categories || this.data.categories,
        hasMore: nl.length < r.total
      })
    } catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  switchCategory(e){ this.setData({currentCategory:e.currentTarget.dataset.category},()=>this.loadMedia(false)) },
  loadMore(){ this.setData({page:this.data.page+1},()=>this.loadMedia(true)) },
  previewMedia(e){
    const item=e.currentTarget.dataset.item
    if(item.type==="image") wx.previewImage({
      urls:this.data.mediaList
        .filter(m=>m.type==="image")
        .map(m=>m.urlTemp || m.thumbnailUrl || m.url)
        .filter(Boolean),
      current:item.urlTemp || item.thumbnailUrl || item.url
    })
    else if(item.type==="video") wx.navigateTo({url:"/pages/article/detail?id="+item._id})
  }
})
