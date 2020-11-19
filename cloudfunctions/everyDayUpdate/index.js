// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let result = []
  let tag = true
  const db = cloud.database()
  const _ = db.command
  //获取今日学习了的用户
  await db.collection('user').where({
      lastStudy: _.neq(0),
      todayStudy: _.eq(0)
    })
    .update({
      data: {
        lastStudy: 0
      }
    })
  while (tag) {
    await db.collection('user').where({
        todayStudy: _.gt(0)
      })
     .get().then(res => {
        result = result.concat(res.data)
        if (res.data.length < 100) {
          tag = false
        }
      })
  }
  result.forEach((user, index) => {
    const arr = user.recent7DayStudy
    arr.shift()
    arr.push(user.todayStudy)
    db.collection('user').where({
      _openid: user._openid
    }).update({
      data: {
        totalStudy: user.totalStudy + user.totalStudy,
        recent7DayStudy: arr,
        lastStudy: user.lastStudy + 1,
        todayStudy: 0
      }
    })
  })

  tag = true
  result = []
  while (tag) {
    await db.collection('user')
      .where({
        recent7DayStudy: _.elemMatch(
          _.gt(0)
        )
      })
      .get().then(res => {
        result = result.concat(res.data)
        if (res.data.length < 100) {
          tag = false
        }
      })
  }
  result.forEach((user, index) => {
    const arr = user.recent7DayStudy
    arr.shift()
    arr.push(0)
    db.collection('user').where({
      _openid: user._openid
    }).update({
      data: {
        recent7DayStudy: arr,
      }
    })
  })
}