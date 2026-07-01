const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const adminRes = await db.collection('users').where({
      openid: OPENID, role: 'admin'
    }).get()
    if (adminRes.data.length === 0) {
      return { code: 401, error: '无权限' }
    }
    
    const { mediaId, title, description, category, sortOrder } = event
    await db.collection('media_items').doc(mediaId).update({
      data: {
        title, description, category, sortOrder,
        updatedAt: db.serverDate()
      }
    })
    return { code: 0 }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
