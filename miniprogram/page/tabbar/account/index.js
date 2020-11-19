// miniprogram/pages/account/account.js
const app = getApp();

Component({
  data: {
    navHeight: app.globalData.navHeight,
    tabscroolHeight: app.globalData.tabscrollHeight,
    username: "",
    userhead: "",
    logged: false
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
  },
  attached: function () {
    if (app.globalData.user) {
      this.setData({
        logged: true,
        userhead: app.globalData.user[0].headImg,
        username: app.globalData.user[0].name
      })
    } else {
      this.setData({
        username: "点击头像登陆",
        userhead: "/page/uiimg/person.png",
      })
    }
  },
  methods: {
    onGetUserInfo: function (e) {
      if (!this.data.logged && e.detail.userInfo) {
        this.setData({
          logged: true,
          userhead: e.detail.userInfo.avatarUrl,
          username: e.detail.userInfo.nickName
        })
        getopenid(e.detail.userInfo.avatarUrl, e.detail.userInfo.nickName)
      }

    }
  },
})

function getopenid(headImg, username) {
  const db = wx.cloud.database()
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => { //获取openid
      console.log('[云函数] [login] user openid: ', res.result)
      app.globalData.openid = res.result.openid
      if (res.result.user.length > 0) { //已注册
        console.log('exsist')
        app.globalData.user = res.result.user
        app.globalData.updateMyCourse = true
        app.globalData.updateStudyTime = true
      } else {
        var user = {
          name: username,
          headImg: headImg,
          todayStudy: 0,
          lastStudy: 0,
          totalStudy: 0,
          recent7DayStudy: [0, 0, 0, 0, 0, 0, 0],
          course: []
        }
        db.collection('user').add({
            data: user
          }) //注册
          .then(res => {
            console.log(res)
            user.comment = []
            app.globalData.user = [user]
            app.globalData.updateMyCourse = true
            app.globalData.updateStudyTime = true
          })
      }
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}