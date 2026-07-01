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
    
    const { name, category, description, icon, level, order } = event
    const res = await db.collection('skills').add({
      data: {
        name, category: category || '未分类', description: description || '',
        icon: icon || '⭐', level: level || 3, order: order || 0,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    return { code: 0, data: res._id }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
