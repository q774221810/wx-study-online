// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let cno = event.cno
  let skip = event.skip
  const $ = cloud.database().command.aggregate
  return await cloud.database().collection('coursecomment')
    .aggregate()
    .match({
      _cno: cno
    })
    .lookup({
      from: "user",
      localField: '_openid',
      foreignField: '_openid',
      as: 'uapproval'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$uapproval', 0]), '$$ROOT'])
    })
    .sort({
      date: -1
    }).project({
      _id: 0,
      _cno:1,
      comment: 1,
      hasStudy: 1,
      headImg: 1,
      name: 1,
      rate: 1,
      date: $.dateToString({
        date: '$date',
        format: '%Y-%m-%d'
      })
    }).limit(10).skip(skip)
    .end().then(res => {
      return res
    })

}