// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
 var arrType
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  arrType= 'count'
  const pArr = []
  if (event.type == 'all') {
    arrType='all'
    pArr.push(check('todayStudy'))
    pArr.push(check('lastStudy'))
    pArr.push(check('totalStudy'))
  } else {
    event.todayStudy && pArr.push(check('todayStudy', event.todayStudy.time))
    event.lastStudy && pArr.push(check('lastStudy', event.lastStudy.time))
    event.totalStudy && pArr.push(check('totalStudy', event.totalStudy.time))
  }

  console.log(pArr)
  const res = await Promise.all(pArr)
  console.log(res)

  return res
}

function check(type, val = 0) {
  const db = cloud.database()
  const _ = db.command
  return arrType == 'count' ?
    new Promise((resolve, reject) => {
      db.collection('user')
        .where({
          [type]: _.gt(val)
        })
        .count().then(res => {
          resolve(res.total)
        })
    }) : new Promise((resolve, reject) => {
      db.collection('user')
        .orderBy(type, 'desc')
        .get().then(res => {
          resolve(res.data)
        })
    })
}