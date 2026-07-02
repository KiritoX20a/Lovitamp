Component({
  data: {
    selected: 0,
    color: "#8A918C",
    selectedColor: "#2F6B57",
    list: [
      {
        pagePath: "/pages/index/home",
        text: "首页",
        iconPath: "/images/tab/home.png",
        selectedIconPath: "/images/tab/home-active.png"
      },
      {
        pagePath: "/pages/skills/home",
        text: "技能",
        iconPath: "/images/tab/skills.png",
        selectedIconPath: "/images/tab/skills-active.png"
      },
      {
        pagePath: "/pages/portfolio/home",
        text: "作品集",
        iconPath: "/images/tab/portfolio.png",
        selectedIconPath: "/images/tab/portfolio-active.png"
      },
      {
        pagePath: "/pages/about/home",
        text: "关于我",
        iconPath: "/images/tab/about.png",
        selectedIconPath: "/images/tab/about-active.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  }
})
