function callCloudFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data
    }).then(res => {
      resolve(res.result)
    }).catch(err => {
      console.error(`云函数 ${name} 调用失败:`, err)
      reject(err)
    })
  })
}

function checkAdmin() {
  return callCloudFunction('checkAdmin')
}

function getArticles(params = {}) {
  return callCloudFunction('getArticles', params)
}

function getArticleDetail(articleId) {
  return callCloudFunction('getArticleDetail', { articleId })
}

function createArticle(data) {
  return callCloudFunction('createArticle', data)
}

function updateArticle(articleId, data) {
  return callCloudFunction('updateArticle', { articleId, ...data })
}

function deleteArticle(articleId) {
  return callCloudFunction('deleteArticle', { articleId })
}

function getSkills() {
  return callCloudFunction('getSkills')
}

function createSkill(data) {
  return callCloudFunction('createSkill', data)
}

function updateSkill(skillId, data) {
  return callCloudFunction('updateSkill', { skillId, ...data })
}

function deleteSkill(skillId) {
  return callCloudFunction('deleteSkill', { skillId })
}

function getMedia(params = {}) {
  return callCloudFunction('getMedia', params)
}

function updateMedia(mediaId, data) {
  return callCloudFunction('updateMedia', { mediaId, ...data })
}

function deleteMedia(mediaId, fileId) {
  return callCloudFunction('deleteMedia', { mediaId, fileId })
}

module.exports = {
  callCloudFunction,
  checkAdmin,
  getArticles,
  getArticleDetail,
  createArticle,
  updateArticle,
  deleteArticle,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getMedia,
  updateMedia,
  deleteMedia
}
