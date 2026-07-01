const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { articleId:"", isEdit:false, title:"", summary:"", content:"", coverImage:"", category:"", tagsStr:"", typeOptions:["BLOG","VLOG"], typeIndex:0, status:"draft" },
  onLoad(o){ if(o.id){ this.setData({articleId:o.id,isEdit:true}); this.loadArticle(o.id) } },
  async loadArticle(id){
    util.showLoading()
    try{ const r=await api.getArticleDetail(id); const a=r.data; this.setData({title:a.title||"",summary:a.summary||"",content:a.content||"",coverImage:a.coverImage||"",category:a.category||"",tagsStr:(a.tags||[]).join(","),typeIndex:a.type==="vlog"?1:0,status:a.status||"draft"}) }
    catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  onInput(e){ this.setData({[e.currentTarget.dataset.field]:e.detail.value}) },
  onTagsInput(e){ this.setData({tagsStr:e.detail.value}) },
  onTypeChange(e){ this.setData({typeIndex:parseInt(e.detail.value)}) },
  chooseCover(){
    wx.chooseImage({count:1,sizeType:["compressed"],sourceType:["album","camera"],
      success:(r)=>{
        util.showLoading("上传中...")
        wx.cloud.uploadFile({cloudPath:"covers/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+".jpg",filePath:r.tempFilePaths[0]}
        ).then(ur=>{ this.setData({coverImage:ur.fileID}); util.hideLoading(); util.showToast("上传成功","success") }
        ).catch(()=>{ util.hideLoading(); util.showToast("上传失败") })
      }
    })
  },
  saveAsDraft(){ this.save("draft") },
  publish(){ this.save("published") },
  async save(status){
    const data={title:this.data.title,summary:this.data.summary,content:this.data.content,coverImage:this.data.coverImage,category:this.data.category,tags:this.data.tagsStr.split(",").map(s=>s.trim()).filter(Boolean),type:this.data.typeIndex===1?"vlog":"blog",status}
    util.showLoading("保存中...")
    try{
      if(this.data.isEdit) await api.updateArticle(this.data.articleId,data)
      else await api.createArticle(data)
      util.showToast("保存成功","success"); setTimeout(()=>wx.navigateBack(),1500)
    }catch(e){ util.showToast("保存失败") }
    util.hideLoading()
  },
  async deleteArticle(){
    wx.showModal({title:"确认删除",content:"删除后不可恢复",success:async(r)=>{
      if(r.confirm){
        util.showLoading("删除中...")
        try{ await api.deleteArticle(this.data.articleId); util.showToast("删除成功","success"); setTimeout(()=>wx.navigateBack(),1500) }
        catch(e){ util.showToast("删除失败") }
        util.hideLoading()
      }
    }})
  }
})