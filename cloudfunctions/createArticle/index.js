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
    
    const { title, summary, content, coverImage, tags, category, type, status } = event
    const res = await db.collection('articles').add({
      data: {
        title, summary, content, coverImage,
        tags: tags || [],
        category: category || '',
        type: type || 'blog',
        status: status || 'draft',
        publishDate: db.serverDate(),
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    return { code: 0, data: res._id }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
