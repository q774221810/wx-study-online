// components/swiper/homeswiper.js
Component({
  properties: {

  },
  data: {
    background: ['../../page/swiperimg/banner1.png', '../../page/swiperimg/banner2.png'
                ,'../../page/swiperimg/banner3.png']
  },
 pageLifetimes:{
  attached:function(){
    wx.getSystemInfo({
      success: res => {
       this.setData({
        width:res.screenWidth
       })
       console.log(this.data.width)
      },
      fail(err) {
        console.log(err);
      }
    })
   }
 },
  methods: {

  }
})
