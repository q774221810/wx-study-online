// components/navbar.js
var app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
   attached:function(){
    this.setData({
      navHeight : app.globalData.navHeight,
      navTop : app.globalData.navTop,
      searchHeight: app.globalData.searchHeight,
     })
   }
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cl:function(){
       console.log(this.data.navHeight)
    },
   search:function(){
     wx.navigateTo({
       url: '/page/index/pages/search/search',
     })
   }
  }
})
