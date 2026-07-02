const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { type, category, page = 1, pageSize = 10 } = event
  const skip = (page - 1) * pageSize
  
  try {
    let query = { status: 'published' }
    if (type) query.type = type
    if (category) query.category = category
    
    const countResult = await db.collection('articles').where(query).count()
    const res = await db.collection('articles')
      .where(query)
      .orderBy('publishDate', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    const fileIds = [...new Set(
      res.data
        .map((item) => item.coverImage)
        .filter(Boolean)
    )]

    let tempUrlMap = {}
    if (fileIds.length > 0) {
      const tempRes = await cloud.getTempFileURL({
        fileList: fileIds
      })
      tempUrlMap = tempRes.fileList.reduce((acc, file) => {
        acc[file.fileID] = file.tempFileURL
        return acc
      }, {})
    }

    const data = res.data.map((item) => ({
      ...item,
      coverImageUrl: item.coverImage ? tempUrlMap[item.coverImage] || '' : ''
    }))
    
    return {
      code: 0,
      data,
      total: countResult.total,
      page,
      pageSize
    }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
