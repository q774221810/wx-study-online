// components/sortcourse/sortcourse.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

    courselist: {
      now:'全部',
      show: false,
      name: ['全部', '外语', '计算机', '工学', '医药卫生', '法学', '农林园艺', '心理学', '经济管理', ]
    },
    chooselist: {
      now:'筛选',
      show: false,
      name: ['综合','热门','最新', ]
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose: function () {
      console.log(123);
      this.setData({
        choosetype: '最新'
      })
    }
  }
})