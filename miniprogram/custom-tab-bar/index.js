Component({
  data: {
    selected: 0,
    color: "#bfbfbf",
    selectedColor: "#6b74f7",
    list: [{
      pagePath: "/page/tabbar/index/index",
      text: "首页",
      iconPath: "/page/uiimg/tabbar-home.png",
      selectedIconPath: "/page/uiimg/tabbar-home-active.png"
    },
    {
      pagePath: "/page/tabbar/mycourse/index",
      text: "我的学习",
      iconPath: "/page/uiimg/tabbar-study.png",
      selectedIconPath: "/page/uiimg/tabbar-study-active.png"
    },
    {
      pagePath: "/page/tabbar/account/index",
      text: "账号",
      iconPath: "/page/uiimg/tabbar-student.png",
      selectedIconPath: "/page/uiimg/tabbar-student-active.png"
    }
  ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})