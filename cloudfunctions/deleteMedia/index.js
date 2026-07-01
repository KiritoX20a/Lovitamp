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
    
    const { mediaId, fileId } = event
    // Delete from cloud storage
    if (fileId) {
      await cloud.deleteFile({ fileList: [fileId] })
    }
    // Delete database record
    await db.collection('media_items').doc(mediaId).remove()
    return { code: 0 }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
