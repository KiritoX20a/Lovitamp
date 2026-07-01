const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { articleId } = event
  
  try {
    const res = await db.collection('articles').doc(articleId).get()
    return { code: 0, data: res.data }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
