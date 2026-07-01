const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { article:{}, renderedContent:"" },
  onLoad(o){ if(o.id) this.loadArticle(o.id) },
  async loadArticle(id){
    util.showLoading()
    try {
      const r = await api.getArticleDetail(id)
      const a = r.data
      const html = this.renderMarkdown(a.content||"")
      this.setData({article:a,renderedContent:html})
      wx.setNavigationBarTitle({title:a.title||"详情"})
    } catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  renderMarkdown(md){
    if(!md) return ""
    return md.replace(/### (.+)/g,"<h3>$1</h3>").replace(/## (.+)/g,"<h2>$1</h2>").replace(/# (.+)/g,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/!\[(.+?)\]\((.+?)\)/g,'<image src="$2" style="width:100%;border-radius:8rpx;margin:16rpx 0" />').replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" style="color:#1a1a2e">$1</a>').replace(/^- (.+)/gm,"<li>$1</li>").replace(/\n/g,"<br/>")
  },
  formatDate(d){ return util.formatDate(d) }
})