//index.js
const app = getApp();
var skip = 0
var sort = 0
var choose = 0

function getCourse(skip1, that, sort1, choose1) {
  var e = {}
  var orderFirst
  var orderSecond
  var courseSort
  switch (sort1) {
    case 0:
      courseSort = 'all'
      break;
    case 1:
      courseSort = 'language'
      break;
    case 2:
      courseSort = 'computer'
      break;
    case 3:
      courseSort = 'engineering'
      break;
    case 4:
      courseSort = 'medicine'
      break;
    case 5:
      courseSort = 'law'
      break;
    case 6:
      courseSort = 'agriculture'
      break;
    case 7:
      courseSort = 'psychology'
      break;
    case 8:
      courseSort = "economics"
      break;
  }
  sort = sort1
  if (sort1 == 0) {
    e = {}
  } else {
    console.log(courseSort)
    e = {
      cclass: courseSort
    }
  }
  switch (choose1) {
    case 0:
      orderFirst = 'uploaddate' /*查询排序条件 */
      orderSecond = '_cno'
      break;
    case 1:
      orderFirst = 'people'
      orderSecond = '_cno'
      break;
    case 2:
      orderFirst = 'uploaddate'
      orderSecond = '_cno'
      break;
  }
  choose = choose1
  wx.cloud.database().collection('course').where(e)
    .field({
      coursepart: 0,
      text: 0,
      _id: 0,
      cclass: 0,
      rate: 0,
      uploaddate: 0
    }).orderBy(orderFirst, 'desc').orderBy(orderSecond, 'asc').limit((skip1 == 0 ? 10 : 6)).skip(skip1)
    .get().then(res => {
      if (skip1 == 0 && sort == 0) { //全部时首次
        that.setData({
          newestCourse: res.data.splice(0, 4),
          course: res.data
        })
        that.setData({
          isButtom: false
        })
        skip=skip+4
        console.log('fisrt all')
      } else {
        var morecourse = that.data.course
        morecourse = morecourse.concat(res.data)
        that.setData({
          course: morecourse
        })
        if (res.data.length < 6) { //为空
          that.setData({
            isButtom: true
          })
        } else {
          that.setData({
            isButtom: false
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
}
Component({
  data: {
    tabscrollHeight: app.globalData.tabscrollHeight,
    isButtom: false,
    newestCourse: '',
    course: ''
  },
  ready: function () {
    var _that = this
    var query = wx.createSelectorQuery()
    query.select('#threeH').boundingClientRect()
    query.exec(function (res) {
      _that.setData({
        threeH: res[0].height
      })
    })
    getCourse(0, this, 0, 0)
  },

  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  methods: {
    scrollToSort: function () {
      this.setData({
        toTop: this.data.threeH
      })
    },
    iconclick: function (e) {
      var e = {
        target: {
          id: e.detail,
          close: true
        }
      }
      this.selectComponent("#sortCourse").sortChange(e)
      this.selectComponent("#sortCourse").openMenu()

    },
    // indexScroll: function (e) {
    //   console.log(e.detail.scrollTop)
    //   if (e.detail.scrollTop >= (this.data.threeH - 5) && !this.data.on) {
    //     console.log('on')
    //     console.log(e.detail.scrollTop)
    //     this.setData({
    //       on: true,
    //       tabscrollHeight: this.data.tabscrollHeight - 50
    //     })
    //   }
    // },
    loadmore: function (e) {
      skip = skip + 6
      getCourse(skip, this, sort, choose)
    },
    getSortCourse: function (e) {
      this.setData({ //置空
        course: [],
        isButtom: false
      })
      skip = 0
      console.log(e)
      getCourse(0, this, parseInt(e.detail.id), choose)
    },
    getChooseCourse: function (e) {
      this.setData({ //置空
        course: [],
        isButtom: false
      })
      skip = 0
      getCourse(0, this, sort, parseInt(e.detail.id))
    }
  },

})