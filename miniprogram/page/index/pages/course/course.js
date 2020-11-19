// miniprogram/page/index/pages/course/course.js
var cno
var skip = 0
var playTotal = 0 /*观看时长*/
var playStar = 0 /*观看开始 */
var playStop = 0 /*观看结束*/
var playNum = 0 /*播放编号 */
const app = getApp()

function getHasStudy(cno, type) {
  /**获取该门课程已学习时长 */
  if (app.globalData.openid) {
    var mycourse = app.globalData.user[0].course
    for (var i = 0; i < mycourse.length; i++) {
      if (mycourse[i]._cno == cno) {
        if (type == 'length') {
          return mycourse[i].hasstudy.length
          break
        } else if (type == 'array') {
          return mycourse[i].hasstudy
        }
        break
      }
    }
  }
  return 0
}

function setHasStudy(id) {
  if (app.globalData.openid) {
    var mycourse = app.globalData.user[0].course
    for (var i = 0; i < mycourse.length; i++) {
      if (mycourse[i]._cno == cno) {
        if (!mycourse[i].hasstudy.includes(id)) {
          mycourse[i].hasstudy.push(id)
          return ''
        }
        break
      }
    }
  }
  return 0
}
Page({
  data: {
    currentTab: 0,
    cname: '',
    school: '',
    rate: '',
    show: false,
    text: '',
    people: '',
    courselist: '',
    buttomview: 0,
    videosrc: '',
    usercomment: '',
    commitcomment: '',
    preuservalue: '',
    uservalue: '',
    rateDistribute: '',
    play: false,
    videotitle: '',
    hasjoin: false,
  },
  onLoad: function (options) {

    // this.getHeight('buttomview')
    // this.getHeight('T0')
    // this.getHeight('T1')
    // this.getHeight('T3')
    cno = options.cno;
    this.setData({
      cno: cno
    })
    console.log(cno)
  },
  onUnload: function () {
    var playStar = app.globalData.playStar
    var exitTotal = 0
    var todayStudy = app.globalData.user[0].recent7DayStudy[6]
    if (app.globalData.openid && (playStar != 0 || app.globalData.playTotal != 0)) {
      var updateData = {}
      if (playStar != 0) {
        exitTotal = (Date.parse(new Date()) - playStar) / 1000 + app.globalData.playTotal
      } else {
        exitTotal = app.globalData.playTotal
      }
      app.globalData.user[0].recent7DayStudy[6] += exitTotal
      if (todayStudy == 0) {
        updateData.lastStudy = wx.cloud.database().command.inc(1)
      }
      wx.cloud.database().collection('user').where({
          'course._cno': cno,
          _openid: app.globalData.openid
        })
        .update({
          data: Object.assign({
            todayStudy: wx.cloud.database().command.inc(exitTotal),
            recent7DayStudy: app.globalData.user[0].recent7DayStudy,
            totalStudy: wx.cloud.database().command.inc(exitTotal),
            'course.$.hasstudy': getHasStudy(cno, 'array')
          },updateData)
        }).then(res => {
          app.globalData.playTotal = 0
          app.globalData.playStar = 0
        })
    }

  },
  onShow: function () {
    skip = 0
    playNum = 0,
    this.setData({
      hasjoin:false
    })
    this.getCourseComent()
    this.getCourseDetail()
    if (app.globalData.user) {
      var flag = app.globalData.user[0].course.some(course => {
        if (course._cno == cno) {
          this.setData({
            hasjoin: true
          })
          return true
        }
      })
    }
    if (!flag) {
      this.getHeight('buttomview')
    }
    this.checkComment()
  },
  getHeight: function (name) {
    var _that = this
    var query = wx.createSelectorQuery()
    query.select('#' + name).boundingClientRect()
    query.exec(function (res) {
      //res就是 该元素的信息 数组
      //取高度
      _that.setData({
        [name]: res[0].height
      })
    })
  },
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  showlist: function (e) {
    var that = this
    if (this.data.courselist[e.target.id].listshow || this.data.courselist[e.target.id].listshow == false) {
      var item = 'courselist[' + e.target.id + '].listshow'
      var display = that.data.courselist[e.target.id].listshow == 'block' ? 'none' : 'block'
      this.setData({
        [item]: display
      })
    } else if (this.data.courselist[e.target.id].listshow == undefined) {
      var item = 'courselist[' + e.target.id + '].listshow'
      that.setData({
        [item]: 'block'
      })

    }
    this.getHeight('T1')
  },
  joinCourse() {
    if (app.globalData.openid) {
      var db = wx.cloud.database()
      var _ = db.command
      var joindetail = {
        "_cno": cno,
        "hasstudy": [],
        "recentStudyDay": db.serverDate(),
        "signDay": db.serverDate()
      }
      db.collection('user')
        .where({
          _openid: app.globalData.openid
        })
        .update({
          data: {
            course: _.push([
              joindetail
            ])
          }
        }).then(res => {
          app.globalData.updateMyCourse=true
          app.globalData.user[0].course.push(joindetail)
          wx.showToast({
            icon: 'success',
            title: '加入成功~',
            duration: 2500
          })
          this.setData({
            hasjoin: true
          })
        })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请前往账号页面登陆',
        duration: 4000
      })
    }
  },
  evalute: function () {
    var hasstudy = getHasStudy(cno, 'length')
    if (hasstudy == 0) {
      /*未学习不能评论 */
      wx.showToast({
        icon: 'none',
        title: '未学习不能评论',
        duration: 2000
      })
    } else {
      this.setData({
        rateDialog: true,
        preuservalue: 5,
      })
    }

  },
  confirmRate(event) {
    var confirmValue = this.data.preuservalue
    skip = 0
    if (this.data.uservalue == '') {
      /*未评分未评论 */
      var hasstudy = getHasStudy(cno, 'length')
      var commitdetail = {
        _cno: cno,
        date: wx.cloud.database().serverDate(),
        hasStudy: hasstudy,
        rate: confirmValue
      }
      if (this.data.usercomment) {
        /*有评论 */
        commitdetail.comment = this.data.usercomment
      }
      wx.cloud.database().collection('coursecomment')
        .add({
          data: commitdetail
        }).then(res => {
          console.log(res)
          wx.showToast({
            title: '评论成功~',
          })
          skip = 0
          app.globalData.user[0].comment.push(commitdetail)
          this.getCourseComent()
          this.checkComment()
        })
    } else {
      /*已评分未评论补充评论 */
      var commentupdate = {}
      var changeflag = false
      if (this.data.uservalue != this.data.preuservalue) {
        /*评分修改 */
        commentupdate.rate = this.data.preuservalue
        changeflag = true
      }
      if (this.data.usercomment) {
        /**评论修改 */
        commentupdate.comment = this.data.usercomment
        changeflag = true
      }
      if (changeflag) {
        commentupdate.date = wx.cloud.database().serverDate()
        wx.cloud.database().collection('coursecomment').where({
            _openid: app.globalData.openid
          })
          .update({
            data: commentupdate
          }).then(res => {
            wx.showToast({
              title: '修改成功~',
            })
            app.globalData.user[0].comment.some(item => {
              if (item._cno == cno) {
                item.rate = this.data.preuservalue,
                  item.comment = this.data.usercomment
                console.log(item)
              }
            })
            this.getCourseComent()
            this.checkComment()
          })
      }
    }



    // this.setData({
    //   uservalue: confirmValue
    // })
    // if (this.data.usercomment) {
    //   this.setData({
    //     commitcomment: this.data.usercomment
    //   })
    // }
  },
  onClose() {
    this.setData({
      close: false,
    });
  },
  onCancel() {
    this.setData({
      usercomment: ''
    });
  },
  onChange(event) {
    this.setData({
      preuservalue: event.detail
    });
  },
  checkComment() {
    if (app.globalData.user) {
      var comment = app.globalData.user[0].comment
      if (comment) {
        comment.some(item => {
          if (item._cno == cno) {
            this.setData({
              uservalue: item.rate,
              commitcomment: item.comment
            })
          }
        })
      }
    }
  },
  playcourse(event) {
    if (!this.data.play) {
      this.setData({
        play: true
      })
    }
    playNum = event.target.id
    this.setData({
      videosrc: 'https://7975-yun-in796-1300055920.tcb.qcloud.la/coursevideo/' + cno + '-' + event.target.id + '.mp4',
      videotitle: event.target.dataset.title
    })
  },
  getCourseComent() {
    wx.cloud.callFunction({
      name: 'getCourseComment',
      data: {
        cno: cno,
        skip: skip
      }
    }).then(res => {
      console.log(res)
      skip = skip + 10
      this.setData({
        commentlist: res.result.list
      })
      this.getHeight('T3')
    })
  },
  getCourseDetail() {
    wx.cloud.database().collection('course')
      .where({
        _cno: cno
      })
      .field({
        _cno: 0,
        _id: 0,
        cclass: 0,
        uploaddate: 0
      })
      .get().then(res => {
        console.log(res)
        var course = res.data[0]
        this.setData({
          cname: course.cname,
          people: course.people,
          courselist: course.coursepart,
          rate: Number.isInteger(course.rate) ? course.rate + '.0' : course.rate,
          school: course.school,
          rateDistribute: course.rateDetail,
          text: course.text.replace(/\\n/g, "\n")
        })

        this.getHeight('T0')
        this.getHeight('T1')
        this.getHeight('T3')
      })

  },
  videoplay() {
    playStar = Date.parse(new Date())
    app.globalData.playStar = playStar
    setHasStudy(playNum)
    app.globalData.updateStudyTime=true
  },
  videopause(e) {
    playStop = Date.parse(new Date())
    app.globalData.playTotal += (playStop - playStar) / 1000
    app.globalData.playStar = 0
  },
  videoerror(e) {
    console.log(e)
    wx.showToast({
      title: '课程未上传视频',
      icon: 'none',
      duration: 2000
    })
    wx.createVideoContext('myvideo', this).stop()
  }
})