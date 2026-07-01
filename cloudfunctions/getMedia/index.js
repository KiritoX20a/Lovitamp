const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { category, page = 1, pageSize = 20 } = event
  const skip = (page - 1) * pageSize
  
  try {
    let query = {}
    if (category) query.category = category
    
    const countResult = await db.collection('media_items').where(query).count()
    const res = await db.collection('media_items')
      .where(query)
      .orderBy('sortOrder', 'asc')
      .skip(skip)
      .limit(pageSize)
      .get()
    
    return {
      code: 0,
      data: res.data,
      total: countResult.total,
      page,
      pageSize
    }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
