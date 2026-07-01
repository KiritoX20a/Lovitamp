const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const res = await db.collection('users').where({
      openid: OPENID,
      role: 'admin'
    }).get()
    
    return {
      code: 0,
      isAdmin: res.data.length > 0,
      openid: OPENID
    }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
