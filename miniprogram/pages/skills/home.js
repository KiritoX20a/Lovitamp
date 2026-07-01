const api = require("../../utils/api")
const util = require("../../utils/util")
Page({
  data: { skillCategories: [] },
  onLoad() { this.loadSkills() },
  onShow() { if(typeof this.getTabBar==="function") this.getTabBar().setData({selected:1}) },
  async loadSkills() {
    util.showLoading()
    try {
      const r = await api.getSkills()
      const skills = r.data || []
      const cats = {}
      skills.forEach(s=>{ if(!cats[s.category]) cats[s.category]={name:s.category,skills:[]}; cats[s.category].skills.push(s) })
      this.setData({skillCategories:Object.values(cats)})
    } catch(e){ util.showToast("加载技能失败") }
    util.hideLoading()
  }
})