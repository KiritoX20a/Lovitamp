const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { skillList:[] },
  onLoad(){ this.loadSkills() },
  onShow(){ this.loadSkills() },
  async loadSkills(){
    util.showLoading()
    try{ const r=await api.getSkills(); this.setData({skillList:r.data||[]}) }
    catch(e){ util.showToast("加载失败") }
    util.hideLoading()
  },
  addSkill(){ wx.showModal({title:"添加技能",placeholderText:"技能名称",success:async(r)=>{
    if(r.confirm){
      try{ await api.createSkill({name:r.content||"新技能",category:"未分类",description:"",icon:"⭐",level:3,order:this.data.skillList.length}); util.showToast("添加成功","success"); this.loadSkills() }
      catch(e){ util.showToast("添加失败") }
    }
  }}) },
  editSkill(e){ wx.showToast({title:"编辑功能待实现",icon:"none"}) },
  deleteSkill(e){
    wx.showModal({title:"确认删除",content:"确定要删除这个技能吗？",success:async(r)=>{
      if(r.confirm){
        util.showLoading("删除中...")
        try{ await api.deleteSkill(e.currentTarget.dataset.id); util.showToast("删除成功","success"); this.loadSkills() }
        catch(e){ util.showToast("删除失败") }
        util.hideLoading()
      }
    }})
  }
})