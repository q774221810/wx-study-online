// miniprogram/page/mycourse/pages/studyRank/studyRank.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
  },
  onChange(event) {
    this.setData({
      active:event.detail.index,
      nowArr:[],
      myRank:{}
    })
   this.getRank(event.detail.index)
  },
  getRank(id){
    wx.cloud.callFunction({
      name: 'getMyrank',
      data: {
        type: 'all',
      },
      success: res => {
        console.log(res)
        this.setData({
          rankArr: res.result,
          nowArr: res.result[id]
        })
        this.data.nowArr.forEach((obj,index)=>{
          if(obj._openid==app.globalData.openid){
            this.setData({
              myRank:{
                headImg:obj.headImg,
                lastStudy:obj.lastStudy,
                todayStudy:obj.todayStudy,
                totalStudy:obj.totalStudy,
                name:obj.name,
                index:index+1
              }
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [getmycourse] 调用失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRank(0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})