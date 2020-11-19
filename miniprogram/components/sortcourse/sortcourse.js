// components/sortcourse/sortcourse.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    minheight: Number,
    course: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    // course: {
    //   coursedetail: [{
    //     name: "大学物理",
    //     school: "清华大学",
    //     number: 4396,
    //     time: 48,
    //     imgurl: "/page/swiperimg/electric.jpg"
    //   }, {
    //     name: "中学物理之九级物理",
    //     school: "清华大学阿姆斯洛",
    //     number: 396,
    //     time: 28,
    //     imgurl: "/page/swiperimg/electric.jpg"
    //   }, {
    //     name: "物理",
    //     school: "清华大学之青山大学",
    //     number: 14396,
    //     time: 8,
    //     imgurl: "/page/swiperimg/electric.jpg"
    //   }, {
    //     name: "物理",
    //     school: "清华大学之青山大学",
    //     number: 14396,
    //     time: 8,
    //     imgurl: "/page/swiperimg/electric.jpg"
    //   }, {
    //     name: "物理",
    //     school: "清华大学之青山大学",
    //     number: 14396,
    //     time: 8,
    //     imgurl: "/page/swiperimg/electric.jpg"
    //   }, {
    //     name: "物理",
    //     school: "清华大学之青山大学",
    //     number: 14396,
    //     time: 8,
    //     imgurl: "/page/swiperimg/electric.jpg"
    //   }, ],
    // },
    courselist: {
      now: 0,
      name: ['全部', '外语', '计算机', '工学', '医药卫生', '法学', '农林园艺', '心理学', '经济管理', ]
    },
    chooselist: {
      now: 0,
      name: ['综合', '热门', '最新', ]
    },
    sortTitle: "全部",
    chooseTitle: "筛选",
  },
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    sortChange: function (e) {
      var id = e.target.id
      var now = "courselist.now"
      if (now != id) {
        var title = this.data.courselist.name[id]
        this.setData({
          sortTitle: title,
          [now]: id
        })
        this.triggerEvent('getSortCourse', {
          id
        })
      }
      if (!e.target.close) { //阻止icno触发打开item
        this.selectComponent("#item1").toggle()
      }

    },
    chooseChange: function (e) {
      var id = e.target.id
      var nowid = this.data.chooselist.now
      var now = "chooselist.now"
      if (nowid != id) {
        console.log('change')
        var title = this.data.chooselist.name[id]
        this.setData({
          chooseTitle: title,
          [now]: id
        })
        this.triggerEvent('getChooseCourse', {
          id
        })
      } else if (id == 0) {
        this.setData({
          chooseTitle: '综合',
        })
      }
      this.selectComponent("#item2").toggle()
    },
    openMenu: function () { //触发父组件滚动至区域
      this.triggerEvent('scrollToSort', )
    },
  },

})