const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const $ = db.command.aggregate
  const _ = db.command
  var mydetail
  await db.collection('user')
    .aggregate()
    .match({
      _openid: wxContext.OPENID
    })
    .lookup({
      from: 'coursecomment',
      let: {
        openid: '$_openid',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_openid', '$$openid']),
        ])))
        .project({
          _id: 0,
          comment: 1,
          rate: 1,
          _cno: 1,
          hasStudy: 1,
          date: $.dateToString({
            date: '$date',
            format: '%Y-%m-%d'
          })
        })
        .done(),
      as: 'comment',
    })
    .end().then(res => {
      mydetail = res.list
    }).catch(err => {
      console.log(err)
    })
  return {
    openid: wxContext.OPENID,
    user: mydetail
  }

}