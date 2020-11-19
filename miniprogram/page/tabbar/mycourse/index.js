// miniprogram/pages/mycourse/mycourse.js
import * as echarts from '../../../components/ec-canvas/echarts';
const app = getApp();
var chart = null
var outThat

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {
    color: ["#6b74f7"],
    legend: {
      data: ['A'],
      // top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    grid: {
      // containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      offset: 10,
      data: getSevenDay(),
      axisLabel: {
        show: true,
        textStyle: {
          color: 'black', //更改坐标轴文字颜色
          fontSize: 16 //更改坐标轴文字大小
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        show: true
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      // smooth: true,
      data: [0, 0, 0, 0, 0, 0, 0],
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: { //数值样式
              color: 'black',
              fontSize: 14
            }
          }
        }
      }
    }]
  };
  chart.setOption(option);
  outThat.setData({
    chartLoaded: true
  })
  return chart;
}

function getmycourse(that) {
  if (app.globalData.updateMyCourse) {
    wx.cloud.callFunction({
      name: 'getmycourse',
      data: {},
      success: res => {
        console.log(res)
        that.setData({
          myCourseList: res.result.course.list
        })
        app.globalData.updateMyCourse = false
      },
      fail: err => {
        console.error('[云函数] [getmycourse] 调用失败', err)
      }
    })
  }
}

function getDay() {
  var timestamp = Date.parse(new Date())
  var date = new Date(timestamp)
  // var Y =date.getFullYear();
  // //获取月份  
  // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  // //获取当日日期 
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return D
}

function getSevenDay() {
  var day1 = new Date();
  var SevenDay = []
  for (var i = 0; i < 6; i++) {
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
    var s1 = (day1.getMonth() + 1) + "." + day1.getDate()
    SevenDay[5 - i] = s1
  }
  SevenDay[6] = '今天'
  return SevenDay
}

function getMyStudyTime(that) {
  var day = getDay()
  if (day != that.data.day || app.globalData.updateStudyTime) {
    wx.cloud.database().collection('user').where({
      _openid: app.globalData.openid //查询注册
    }).field({
      lastStudy: 1,
      todayStudy: 1,
      totalStudy: 1,
      recent7DayStudy: 1
    }).get().then(res2 => {
      if (res2.data.length > 0) {
        that.setData({
          studyTimeDetail: {
            todayStudy: res2.data[0].todayStudy,
            lastStudy: res2.data[0].lastStudy,
            totalStudy: res2.data[0].totalStudy,
            recent7DayStudy: res2.data[0].recent7DayStudy,
          }
        })
        if (day != that.data.day) { //换了一天
          chart.setOption({
            xAxis: [{
              data: getSevenDay()
            }]
          })
        }
        if (chart != null) {
          var recent7DayStudy = res2.data[0].recent7DayStudy.concat()
          recent7DayStudy.forEach(function (item, index, arr) {
            arr[index] = Math.floor(arr[index] / 60)
          })
          chart.setOption({
            series: [{
              data: recent7DayStudy
            }]
          })
          app.globalData.updateStudyTime = false
          console.log(res2)
        }
      }
    })
  }
}
Component({
  data: {
    ec: {
      onInit: initChart
    },
    day: '',
    isLogin: false,
    unLogin: false,
    tabscrollHeight: app.globalData.tabscrollHeight,
    chartLoaded: false
  },
  observers: {
    'chartLoaded': function () {
      console.log('chartLoaded')
      getMyStudyTime(this)
    },
    'studyTimeDetail': function () {
      this.getTodayRank()
    }
  },
  lifetimes: {
    ready: function () {
      outThat = this
    },
    attached: function () {
      this.setData({
        day: getDay(),
      })
    }
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      if (app.globalData.openid && !this.data.isLogin) {
        this.setData({
          isLogin: true,
          unLogin: false
        })
      } else if (!app.globalData.openid) {
        this.setData({
          unLogin: true
        })
      }
      if (app.globalData.openid) {
        getmycourse(this)
      }
      if (this.data.chartLoaded) {
        getMyStudyTime(this)
      }
      this.data.studyTimeDetail && this.getTodayRank()
    }
  },
  methods: {
    navToAccount: function () {
      wx.switchTab({
        url: '/page/tabbar/account/index'
      })
    },
    exitCourse(e) {
      var that = this
      wx.showModal({
        title: '退出课程',
        content: '确定退出' + e.target.dataset.cname + '吗？',
        success(res) {
          if (res.cancel) {

          } else {
            var db = wx.cloud.database()
            var _ = db.command
            db.collection('user').where({
                _openid: app.globalData.openid
              })
              .update({
                data: {
                  course: _.pull({
                    _cno: _.eq(e.target.dataset.cno)
                  })
                }
              }).then(res => {
                console.log(res)
                wx.showToast({
                  title: '退出成功',
                  duration: 2000
                })
                for (var i = 0; i < app.globalData.user[0].course.length; i++) {
                  if (app.globalData.user[0].course[i]._cno == e.target.dataset.cno) {
                    app.globalData.user[0].course.splice(i, i)
                    break
                  }
                }
                app.globalData.updateMyCourse = true
                getmycourse(that)
              })
          }
        }
      })
      console.log(e)
    },
    getTodayRank() {
      if (!this.data.studyTimeDetail.todayStudy > 0) {
        this.setData({
          rankText: '今天还没学习呢~'
        })
      } else {
        wx.cloud.callFunction({
          name: 'getMyrank',
          data: {
            todayStudy: {
              time: this.data.studyTimeDetail.todayStudy
            }
          },
          success: res => {
            console.log(res)
            this.setData({
              rankText: '今天排名' +( parseInt(res.result) +1)
            })
          },
          fail: err => {
            console.error('[云函数] [getmycourse] 调用失败', err)
          }
        })
      }

    }
  }
})