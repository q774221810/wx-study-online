// components/navbar.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: app.globalData.navHeight,
        navTop: app.globalData.navTop,
        searchHeight: app.globalData.searchHeight,
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    keyWord: ''

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cl: function () {
      console.log(this.data.navHeight)
    },
    search: function () {
      if (this.data.keyWord ) {
        wx.navigateTo({
          url: '/page/index/pages/search/search?keyword=' + this.data.keyWord,
        })
      }else{
        wx.showToast({
          icon:'none',
          title: '关键字不能为空',
        })
      }
    }
  }
})