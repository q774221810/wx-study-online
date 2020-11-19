// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const $ = db.command.aggregate
  const _ = db.command
  var course
  await db.collection('user').aggregate()
    .match({
      _openid: wxContext.OPENID
    }).project({
      course: 1,
      _id: 0,
    }).unwind('$course').lookup({
      from: 'course',
      let: {
        cno: '$course._cno',
      },
      as: 'coursedetail',
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_cno', '$$cno']),
        ]))).
      project({
        cname: 1,
        school: 1,
        ctime: 1,
        _id: 0
      }).done()
    })
    .end().then(res => {
      console.log(res.list)
      var fileList=[]
      for (var i = 0; i < res.list.length; i++) {
        fileList[i] = "cloud://yun-in796.7975-yun-in796-1300055920/courseimg/" + res.list[i].course._cno + ".jpg"
      }
      console.log(fileList)
      cloud.getTempFileURL({
        fileList: fileList,
      }).then(res2 => {
        for(var j=0;j<res2.fileList.length;j++){
          res.list[j].coursedetail.imgUrl=res2.fileList[j].tempFileURL
        }
      })
      course = res
    })
    .catch(err => {
      console.error(err)
    })
  return {
    course
  }

}