// miniprogram/pages/account/account.js
const app = getApp();

Component({
  data:{
    navHeight: app.globalData.navHeight,
    windowHeight:app.globalData.windowHeight
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  }
})