// miniprogram/page/index/pages/search/search.js
Page({
  data: {
    keyWord: '',
    course:''
  },

  onLoad: function (options) {
    this.setData({
      keyWord: options.keyword
    })

  },
  onShow: function () {
    this.onSearch()
  },
  onChange(e) {
    this.setData({
      keyWord: e.detail
    });
  },
  onSearch(e) {
    var db = wx.cloud.database()
    var _ = db.command
    if (this.data.keyWord) {
      db.collection('course').where(_.or([{
          cname: db.RegExp({
            regexp: '.*' + this.data.keyWord,
            options: 'i',
          })
        },
        {
          text: db.RegExp({
            regexp: '.*' + this.data.keyWord,
            options: 's',
          })
        }
      ])).get().then(res => {
        this.setData({
          course:res.data
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '关键字不能为空',
      })
    }
  },

})