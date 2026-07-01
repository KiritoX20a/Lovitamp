const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { mediaList:[], page:1, pageSize:20, hasMore:true },
  onLoad(){ this.loadMedia() },
  onShow(){ this.loadMedia() },
  async loadMedia(){
    util.showLoading()
    try{ const r=await api.getMedia({page:1,pageSize:100}); this.setData({mediaList:r.data||[],hasMore:false}) }
    catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  uploadMedia(){
    wx.showActionSheet({itemList:["上传图片","上传视频"],success:(r)=>{
      if(r.tapIndex===0) this.chooseImage()
      else this.chooseVideo()
    }})
  },
  chooseImage(){
    wx.chooseImage({count:9,sizeType:["compressed"],sourceType:["album"],
      success:(r)=>{
        util.showLoading("上传中...")
        Promise.all(r.tempFilePaths.map((p,i)=>wx.cloud.uploadFile({cloudPath:"media/"+Date.now()+"-"+i+".jpg",filePath:p}))
        ).then(()=>{ util.hideLoading(); util.showToast("上传完成","success"); this.loadMedia() }
        ).catch(()=>{ util.hideLoading(); util.showToast("上传失败") })
      }
    })
  },
  chooseVideo(){
    wx.chooseVideo({sourceType:["album","camera"],maxDuration:120,camera:"back",
      success:(r)=>{
        util.showLoading("上传中...")
        wx.cloud.uploadFile({cloudPath:"media/"+Date.now()+".mp4",filePath:r.tempFilePath}
        ).then(ur=>api.createArticle({title:"",summary:"",content:ur.fileID,coverImage:r.thumbTempFilePath||"",type:"vlog",status:"published"})
        ).then(()=>{ util.hideLoading(); util.showToast("上传成功","success"); this.loadMedia() }
        ).catch(()=>{ util.hideLoading(); util.showToast("上传失败") })
      }
    })
  },
  editMedia(e){ wx.showToast({title:"编辑功能待实现",icon:"none"}) },
  deleteMedia(e){
    const {id,fileid}=e.currentTarget.dataset
    wx.showModal({title:"确认删除",content:"删除后不可恢复",success:async(r)=>{
      if(r.confirm){
        util.showLoading("删除中...")
        try{ await api.deleteMedia(id,fileid); util.showToast("删除成功","success"); this.loadMedia() }
        catch(e){ util.showToast("删除失败") }
        util.hideLoading()
      }
    }})
  }
})