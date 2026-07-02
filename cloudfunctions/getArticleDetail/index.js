const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { articleId } = event
  
  try {
    const res = await db.collection('articles').doc(articleId).get()
    const article = res.data

    const markdownFileIds = article.type === 'blog' && article.content
      ? [...article.content.matchAll(/!\[[^\]]*\]\((cloud:\/\/[^)]+)\)/g)].map((match) => match[1])
      : []

    const fileIds = [...new Set(
      [article.coverImage, article.type === 'vlog' ? article.content : '', ...markdownFileIds]
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

    const data = {
      ...article,
      coverImageUrl: article.coverImage ? tempUrlMap[article.coverImage] || '' : '',
      videoUrl: article.type === 'vlog' && article.content ? tempUrlMap[article.content] || '' : '',
      content: article.type === 'blog' && article.content
        ? article.content.replace(/!\[([^\]]*)\]\((cloud:\/\/[^)]+)\)/g, (match, alt, fileId) => {
            const tempUrl = tempUrlMap[fileId] || fileId
            return `![${alt}](${tempUrl})`
          })
        : article.content
    }

    return { code: 0, data }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
