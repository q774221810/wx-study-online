//app.js
App({
  globalData: {
    updateMyCourse: false, //有无更新课程
    updateStudyTime: false,
    playTotal: 0,
    /*本次学习时长 */
    playStar: 0
  },
  onLaunch: function () {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.searchHeight = menuButtonObject.height;
        this.globalData.tabscrollHeight = res.windowHeight - navHeight - 48;
        console.log(res)
      },
      fail(err) {
        console.log(err);
      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    wx.getSetting({
      success: res3 => {
        if (res3.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
              name: 'login',
              data: {},
            }).then(res => {
              console.log('[云函数] [login] user openid: ', res.result)
              this.globalData.openid = res.result.openid
              this.globalData.user = res.result.user
              this.globalData.updateMyCourse = true
              this.globalData.updateStudyTime = true

            })
            .catch(err => {
              console.error('[云函数] [login] 调用失败', err)
            })
        }
      }
    })
  }

})