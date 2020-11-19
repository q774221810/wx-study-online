// components/sorticon/sorticon.js
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
    iconList: [{
       class: 'language',
       sortname: '外语',
     }, {
      class: 'computer',
      sortname: '计算机',
     }, {
      class: 'engineering',
      sortname: '工学',
     },{
      class: 'medicine',
      sortname: '医药卫生',
     },{
      class: 'law',
      sortname: '法学',
    },{
      class: 'agriculture',
      sortname: '农林园艺',
    },{
      class: 'psychology',
      sortname: '心理学',
    },{
      class: 'economics',
      sortname: '经济管理',
    },],
   },

  /**
   * 组件的方法列表
   */
  methods: {
      iconclick:function(e) {
       var id=e.target.id
        this.triggerEvent('iconclick',id)
      }
  }
})
