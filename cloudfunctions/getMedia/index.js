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
    const categoryResult = await db.collection('media_items')
      .field({
        category: true
      })
      .get()
    const res = await db.collection('media_items')
      .where(query)
      .orderBy('sortOrder', 'asc')
      .skip(skip)
      .limit(pageSize)
      .get()

    const fileIds = [...new Set(
      res.data
        .flatMap((item) => [item.url, item.thumbnail])
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

    const categories = ['全部'].concat(
      [...new Set(
        categoryResult.data
          .map((item) => item.category)
          .filter(Boolean)
      )]
    )

    const data = res.data.map((item) => ({
      ...item,
      urlTemp: item.url ? tempUrlMap[item.url] || '' : '',
      thumbnailUrl: item.thumbnail ? tempUrlMap[item.thumbnail] || '' : ''
    }))
    
    return {
      code: 0,
      data,
      categories,
      total: countResult.total,
      page,
      pageSize
    }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
