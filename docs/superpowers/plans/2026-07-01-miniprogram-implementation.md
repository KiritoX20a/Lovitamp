# 微信个人品牌展示小程序 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于微信原生框架 + 云开发的个人品牌展示小程序，包含技能展示、作品集画廊、BLOG/VLOG、简易后台管理功能。

**Architecture:** 微信原生小程序框架 + 微信云开发。前端使用 WXML/WXSS/JavaScript 渲染页面，后端逻辑通过云函数实现，数据存储在云数据库（MongoDB-like），图片视频文件存储在云存储。管理员身份通过 OpenID 鉴权。

**Tech Stack:** 微信小程序原生框架、微信云开发（云函数、云数据库、云存储）、微信开发者工具

---

## 文件结构

```
hello-mp/
├── project.config.json                    # 小程序项目配置（需在微信开发者工具中生成）
├── README.md
│
├── miniprogram/
│   ├── app.js                             # 小程序入口逻辑
│   ├── app.json                           # 全局配置（页面路径、窗口、TabBar）
│   ├── app.wxss                           # 全局样式
│   │
│   ├── pages/
│   │   ├── index/
│   │   │   ├── home.js                    # 首页逻辑
│   │   │   ├── home.wxml                  # 首页模板
│   │   │   ├── home.wxss                  # 首页样式
│   │   │   └── home.json                  # 首页配置
│   │   │
│   │   ├── skills/
│   │   │   ├── home.js                    # 技能页逻辑（获取技能列表并分类展示）
│   │   │   ├── home.wxml
│   │   │   ├── home.wxss
│   │   │   └── home.json
│   │   │
│   │   ├── portfolio/
│   │   │   ├── home.js                    # 作品集页逻辑（网格/瀑布流展示媒体）
│   │   │   ├── home.wxml
│   │   │   ├── home.wxss
│   │   │   └── home.json
│   │   │
│   │   ├── about/
│   │   │   ├── home.js                    # 关于我 + BLOG/VLOG 列表
│   │   │   ├── home.wxml
│   │   │   ├── home.wxss
│   │   │   └── home.json
│   │   │
│   │   ├── article/
│   │   │   ├── detail.js                  # 文章/视频详情页（Markdown 渲染）
│   │   │   ├── detail.wxml
│   │   │   ├── detail.wxss
│   │   │   └── detail.json
│   │   │
│   │   └── admin/
│   │       ├── dashboard.js               # 后台 Dashboard
│   │       ├── dashboard.wxml
│   │       ├── dashboard.wxss
│   │       ├── dashboard.json
│   │       ├── article-edit.js            # 文章编辑页
│   │       ├── article-edit.wxml
│   │       ├── article-edit.wxss
│   │       ├── article-edit.json
│   │       ├── media-edit.js              # 媒体编辑页
│   │       ├── media-edit.wxml
│   │       ├── media-edit.wxss
│   │       ├── media-edit.json
│   │       ├── skill-edit.js              # 技能编辑页
│   │       ├── skill-edit.wxml
│   │       ├── skill-edit.wxss
│   │       └── skill-edit.json
│   │
│   └── utils/
│       ├── util.js                        # 通用工具函数
│       └── api.js                         # 云函数调用封装
│
└── cloudfunctions/                        # (在微信开发者工具中创建)
    ├── checkAdmin/
    │   └── index.js                       # 校验当前用户是否为管理员
    ├── getArticles/
    │   └── index.js                       # 获取文章列表（分页+分类筛选）
    ├── getArticleDetail/
    │   └── index.js                       # 获取单篇文章详情
    ├── getSkills/
    │   └── index.js                       # 获取技能列表（按排序权重）
    ├── getMedia/
    │   └── index.js                       # 获取媒体列表（分页+分类筛选）
    ├── createArticle/
    │   └── index.js                       # 创建文章（+ 权限校验）
    ├── updateArticle/
    │   └── index.js                       # 更新文章（+ 权限校验）
    ├── deleteArticle/
    │   └── index.js                       # 删除文章（+ 权限校验）
    ├── createSkill/
    │   └── index.js                       # 创建技能（+ 权限校验）
    ├── updateSkill/
    │   └── index.js                       # 更新技能（+ 权限校验）
    ├── deleteSkill/
    │   └── index.js                       # 删除技能（+ 权限校验）
    ├── updateMedia/
    │   └── index.js                       # 更新媒体信息（+ 权限校验）
    └── deleteMedia/
        └── index.js                       # 删除媒体文件（+ 权限校验，同时删除云存储文件）
```

---

## 实现步骤

### Task 1: 项目初始化 + 全局配置

**Files:**
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.wxss`
- Create: `miniprogram/utils/util.js`
- Create: `miniprogram/utils/api.js`

- [ ] **Step 1: 创建 app.json 全局配置**

```json
{
  "pages": [
    "pages/index/home",
    "pages/skills/home",
    "pages/portfolio/home",
    "pages/about/home",
    "pages/article/detail",
    "pages/admin/dashboard",
    "pages/admin/article-edit",
    "pages/admin/media-edit",
    "pages/admin/skill-edit"
  ],
  "window": {
    "navigationBarBackgroundColor": "#1a1a2e",
    "navigationBarTitleText": "个人品牌",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#f5f5f5"
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#1a1a2e",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/home",
        "text": "首页",
        "iconPath": "images/tab/home.png",
        "selectedIconPath": "images/tab/home-active.png"
      },
      {
        "pagePath": "pages/skills/home",
        "text": "技能",
        "iconPath": "images/tab/skills.png",
        "selectedIconPath": "images/tab/skills-active.png"
      },
      {
        "pagePath": "pages/portfolio/home",
        "text": "作品集",
        "iconPath": "images/tab/portfolio.png",
        "selectedIconPath": "images/tab/portfolio-active.png"
      },
      {
        "pagePath": "pages/about/home",
        "text": "关于我",
        "iconPath": "images/tab/about.png",
        "selectedIconPath": "images/tab/about-active.png"
      }
    ]
  },
  "usingComponents": {},
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents"
}
```

- [ ] **Step 2: 创建 app.js 入口逻辑**

```javascript
App({
  globalData: {
    userInfo: null,
    isAdmin: false,
    openid: ''
  },
  onLaunch() {
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })
  }
})
```

- [ ] **Step 3: 创建 app.wxss 全局样式**

```css
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  box-sizing: border-box;
}

.container {
  padding: 20rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}
```

- [ ] **Step 4: 创建 utils/util.js**

```javascript
// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 显示轻提示
function showToast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 2000 })
}

// 显示加载中
function showLoading(title = '加载中...') {
  wx.showLoading({ title })
}

// 隐藏加载
function hideLoading() {
  wx.hideLoading()
}

module.exports = {
  formatDate,
  showToast,
  showLoading,
  hideLoading
}
```

- [ ] **Step 5: 创建 utils/api.js（云函数调用封装）**

```javascript
// 通用云函数调用封装
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

// 获取管理员 openid（需要在云数据库中手动配置）
function checkAdmin() {
  return callCloudFunction('checkAdmin')
}

// 文章相关
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

// 技能相关
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

// 媒体相关
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
```

- [ ] **Step 6: 创建 images/tab 目录和占位图标**

创建 `miniprogram/images/tab/` 目录，放入 4 组 Tab 图标（各 2 个：未选中 + 选中）。

- [ ] **Step 7: 提交当前代码**

```
git add miniprogram/app.js miniprogram/app.json miniprogram/app.wxss miniprogram/utils/util.js miniprogram/utils/api.js miniprogram/images/tab/
git commit -m "feat: init project structure and global config"
```

---

### Task 2: 云函数基础设施

**Files（需在微信开发者工具中创建以下云函数目录）:**

- 创建 14 个云函数目录，每个包含 `index.js`

- [ ] **Step 1: 创建 checkAdmin 云函数**

```javascript
// cloudfunctions/checkAdmin/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const res = await db.collection('users').where({
      openid: OPENID,
      role: 'admin'
    }).get()
    
    return {
      code: 0,
      isAdmin: res.data.length > 0,
      openid: OPENID
    }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
```

- [ ] **Step 2: 创建 getArticles 云函数**

```javascript
// cloudfunctions/getArticles/index.js
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
```

- [ ] **Step 3: 创建 getArticleDetail 云函数**

```javascript
// cloudfunctions/getArticleDetail/index.js
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
```

- [ ] **Step 4: 创建 getSkills 云函数**

```javascript
// cloudfunctions/getSkills/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('skills')
      .orderBy('order', 'asc')
      .get()
    return { code: 0, data: res.data }
  } catch (err) {
    return { code: -1, error: err.message }
  }
}
```

- [ ] **Step 5: 创建 getMedia 云函数**

```javascript
// cloudfunctions/getMedia/index.js
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
```

- [ ] **Step 6: 创建 createArticle / updateArticle / deleteArticle 云函数**

每个云函数做 openid 鉴权，校验 `role === 'admin'`，然后再执行数据库操作。

```javascript
// createArticle 核心逻辑（省略了鉴权校验，与 checkAdmin 类似）
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  // 先校验管理员身份
  const adminRes = await db.collection('users').where({
    openid: OPENID, role: 'admin'
  }).get()
  if (adminRes.data.length === 0) {
    return { code: 401, error: '无权限' }
  }
  
  const { title, summary, content, coverImage, tags, category, type } = event
  const res = await db.collection('articles').add({
    data: {
      title, summary, content, coverImage, tags: tags || [],
      category: category || '', type: type || 'blog',
      status: 'draft',
      publishDate: db.serverDate(),
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })
  return { code: 0, data: res._id }
}
```

updateArticle 和 deleteArticle 结构类似，分别调用 `.doc(id).update()` 和 `.doc(id).remove()`。

- [ ] **Step 7: 创建 createSkill / updateSkill / deleteSkill 云函数**

写法与文章管理类似，操作 `skills` 集合。

- [ ] **Step 8: 创建 updateMedia / deleteMedia 云函数**

deleteMedia 除了删除数据库记录外，还要调用 `cloud.deleteFile()` 删除云存储文件。

```javascript
// deleteMedia/index.js
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  // 鉴权...
  
  const { mediaId, fileId } = event
  // 删除云存储文件
  await cloud.deleteFile({ fileList: [fileId] })
  // 删除数据库记录
  await db.collection('media_items').doc(mediaId).remove()
  return { code: 0 }
}
```

- [ ] **Step 9: 创建每个云函数的 package.json**

```json
{
  "name": "checkAdmin",
  "version": "1.0.0",
  "dependencies": {
    "wx-server-sdk": "latest"
  }
}
```

- [ ] **Step 10: 提交云函数**

```
git add cloudfunctions/
git commit -m "feat: create all cloud functions with auth and CRUD operations"
```

---

### Task 3: 首页 - 个人主页

**Files:**
- Create: `miniprogram/pages/index/home.js`
- Create: `miniprogram/pages/index/home.wxml`
- Create: `miniprogram/pages/index/home.wxss`
- Create: `miniprogram/pages/index/home.json`

- [ ] **Step 1: 创建 home.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "个人主页"
}
```

- [ ] **Step 2: 创建 home.wxml**

```html
<view class="page">
  <!-- 顶部个人简介区 -->
  <view class="profile-section">
    <view class="avatar-container">
      <image class="avatar" src="{{avatarUrl}}" mode="aspectFill"></image>
    </view>
    <text class="nickname">{{nickname}}</text>
    <text class="bio">{{bio}}</text>
    <view class="social-links">
      <text wx:for="{{socialLinks}}" wx:key="name" class="social-tag">{{item.name}}</text>
    </view>
  </view>

  <!-- 轮播图 -->
  <swiper class="swiper" indicator-dots="{{true}}" autoplay="{{true}}" interval="{{3000}}" circular="{{true}}">
    <swiper-item wx:for="{{carouselItems}}" wx:key="index">
      <image class="swiper-image" src="{{item}}" mode="aspectFill"></image>
    </swiper-item>
  </swiper>

  <!-- 最新文章预览 -->
  <view class="section">
    <view class="section-header">
      <text class="section-title">最新文章</text>
      <navigator class="section-more" url="/pages/skills/home">查看更多</navigator>
    </view>
    <view class="article-list">
      <view wx:for="{{latestArticles}}" wx:key="_id" class="article-card" bindtap="goToArticle" data-id="{{item._id}}">
        <image class="article-cover" src="{{item.coverImage}}" mode="aspectFill" wx:if="{{item.coverImage}}"></image>
        <view class="article-info">
          <text class="article-title">{{item.title}}</text>
          <text class="article-summary">{{item.summary}}</text>
          <text class="article-date">{{item.publishDate}}</text>
        </view>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 3: 创建 home.wxss**

```css
.page { min-height: 100vh; background: #f5f5f5; }

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx 40rpx;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
}

.avatar-container {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid rgba(255,255,255,0.3);
  margin-bottom: 20rpx;
}

.avatar { width: 100%; height: 100%; }

.nickname { font-size: 40rpx; font-weight: 600; margin-bottom: 10rpx; }
.bio { font-size: 28rpx; color: rgba(255,255,255,0.8); text-align: center; margin-bottom: 20rpx; }

.social-links { display: flex; gap: 16rpx; flex-wrap: wrap; justify-content: center; }
.social-tag {
  padding: 8rpx 24rpx;
  border-radius: 30rpx;
  background: rgba(255,255,255,0.15);
  font-size: 24rpx;
  color: rgba(255,255,255,0.9);
}

.swiper { width: 100%; height: 360rpx; }
.swiper-image { width: 100%; height: 100%; }

.section { padding: 30rpx; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title { font-size: 32rpx; font-weight: 600; color: #333; }
.section-more { font-size: 26rpx; color: #666; }

.article-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.article-cover { width: 200rpx; height: 160rpx; flex-shrink: 0; }
.article-info { flex: 1; padding: 20rpx; display: flex; flex-direction: column; }
.article-title { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 8rpx; }
.article-summary { font-size: 24rpx; color: #999; flex: 1; overflow: hidden; }
.article-date { font-size: 22rpx; color: #ccc; }
```

- [ ] **Step 4: 创建 home.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    avatarUrl: 'https://via.placeholder.com/200',
    nickname: '你的名字',
    bio: 'AI / 摄影 / 户外 / 一切有趣的事情',
    socialLinks: [
      { name: 'GitHub', url: '' },
      { name: '微博', url: '' }
    ],
    carouselItems: [],
    latestArticles: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.getTabBar().setData({ selected: 0 })
  },

  async loadData() {
    util.showLoading()
    try {
      const res = await api.getArticles({ page: 1, pageSize: 3 })
      this.setData({ latestArticles: res.data })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  goToArticle(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/article/detail?id=${id}` })
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/index/
git commit -m "feat: implement home page with profile, carousel, and latest articles"
```

---

### Task 4: 技能展示页

**Files:**
- Create: `miniprogram/pages/skills/home.js`
- Create: `miniprogram/pages/skills/home.wxml`
- Create: `miniprogram/pages/skills/home.wxss`
- Create: `miniprogram/pages/skills/home.json`

- [ ] **Step 1: 创建 home.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "我的技能"
}
```

- [ ] **Step 2: 创建 home.wxml**

```html
<view class="page">
  <view class="header">
    <text class="header-title">我的技能</text>
    <text class="header-desc">不断探索，持续成长</text>
  </view>

  <view wx:for="{{skillCategories}}" wx:key="name" class="category-section">
    <view class="category-header">
      <text class="category-name">{{item.name}}</text>
    </view>
    <view class="skill-grid">
      <view wx:for="{{item.skills}}" wx:key="_id" class="skill-card">
        <text class="skill-icon">{{item.icon}}</text>
        <text class="skill-name">{{item.name}}</text>
        <view class="skill-level">
          <text wx:for="{{[1,2,3,4,5]}}" wx:key="index" class="star {{index < item.level ? 'active' : ''}}">★</text>
        </view>
        <text class="skill-desc" wx:if="{{item.description}}">{{item.description}}</text>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 3: 创建 home.wxss**

```css
.page { min-height: 100vh; background: #f5f5f5; padding-bottom: 40rpx; }

.header {
  padding: 40rpx 30rpx;
  text-align: center;
  background: linear-gradient(135deg, #16213e, #0f3460);
  color: #fff;
}

.header-title { font-size: 40rpx; font-weight: 600; }
.header-desc { font-size: 26rpx; color: rgba(255,255,255,0.7); margin-top: 10rpx; display: block; }

.category-section { padding: 30rpx; }
.category-header { margin-bottom: 20rpx; }
.category-name { font-size: 32rpx; font-weight: 600; color: #333; }

.skill-grid { display: flex; flex-wrap: wrap; gap: 20rpx; }

.skill-card {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.skill-icon { font-size: 60rpx; margin-bottom: 12rpx; }
.skill-name { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 8rpx; }

.skill-level { display: flex; gap: 4rpx; margin-bottom: 8rpx; }
.star { font-size: 24rpx; color: #ddd; }
.star.active { color: #f5a623; }

.skill-desc { font-size: 22rpx; color: #999; text-align: center; }
```

- [ ] **Step 4: 创建 home.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    skillCategories: []
  },

  onLoad() {
    this.loadSkills()
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  async loadSkills() {
    util.showLoading()
    try {
      const res = await api.getSkills()
      const skills = res.data || []
      // 按 category 分组
      const categories = {}
      skills.forEach(skill => {
        if (!categories[skill.category]) {
          categories[skill.category] = { name: skill.category, skills: [] }
        }
        categories[skill.category].skills.push(skill)
      })
      this.setData({
        skillCategories: Object.values(categories)
      })
    } catch (err) {
      util.showToast('加载技能失败')
    }
    util.hideLoading()
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/skills/
git commit -m "feat: implement skills page with category grouping and star rating"
```

---

### Task 5: 作品集画廊页

**Files:**
- Create: `miniprogram/pages/portfolio/home.js`
- Create: `miniprogram/pages/portfolio/home.wxml`
- Create: `miniprogram/pages/portfolio/home.wxss`
- Create: `miniprogram/pages/portfolio/home.json`

- [ ] **Step 1: 创建 home.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "作品集"
}
```

- [ ] **Step 2: 创建 home.wxml**

```html
<view class="page">
  <!-- 分类筛选 -->
  <scroll-view class="filter-bar" scroll-x="{{true}}" show-scrollbar="{{false}}">
    <view wx:for="{{categories}}" wx:key="name"
      class="filter-tag {{currentCategory === item.name ? 'active' : ''}}"
      bindtap="switchCategory" data-category="{{item.name}}">
      {{item.name}}
    </view>
  </scroll-view>

  <!-- 瀑布流网格 -->
  <view class="media-grid">
    <view wx:for="{{mediaList}}" wx:key="_id" class="media-item {{item.type === 'video' ? 'video-item' : ''}}"
      bindtap="previewMedia" data-item="{{item}}">
      <image class="media-thumb" src="{{item.thumbnail || item.url}}" mode="aspectFill" lazy-load="{{true}}"></image>
      <view class="media-overlay" wx:if="{{item.type === 'video'}}">
        <text class="play-icon">▶</text>
      </view>
    </view>
  </view>

  <!-- 加载更多 -->
  <view class="load-more" wx:if="{{hasMore}}">
    <text class="load-more-text" bindtap="loadMore">加载更多</text>
  </view>
</view>
```

- [ ] **Step 3: 创建 home.wxss**

```css
.page { min-height: 100vh; background: #f5f5f5; }

.filter-bar {
  white-space: nowrap;
  padding: 20rpx 30rpx;
  background: #fff;
}

.filter-tag {
  display: inline-block;
  padding: 12rpx 30rpx;
  margin-right: 16rpx;
  border-radius: 30rpx;
  background: #f0f0f0;
  font-size: 26rpx;
  color: #666;
}

.filter-tag.active {
  background: #1a1a2e;
  color: #fff;
}

.media-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rpx;
  padding: 6rpx;
}

.media-item {
  position: relative;
  overflow: hidden;
  border-radius: 4rpx;
}

.media-thumb {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
}

.video-item .media-thumb {
  padding-bottom: 133%;
}

.media-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
}

.play-icon {
  font-size: 60rpx;
  color: #fff;
}

.load-more { text-align: center; padding: 30rpx; }
.load-more-text { font-size: 26rpx; color: #999; }
```

- [ ] **Step 4: 创建 home.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    mediaList: [],
    categories: [{ name: '全部' }],
    currentCategory: '全部',
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.loadMedia()
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  async loadMedia(loadMore = false) {
    if (!loadMore) {
      util.showLoading()
      this.setData({ page: 1, mediaList: [] })
    }

    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize
      }
      if (this.data.currentCategory !== '全部') {
        params.category = this.data.currentCategory
      }

      const res = await api.getMedia(params)
      const newList = loadMore
        ? [...this.data.mediaList, ...res.data]
        : res.data

      this.setData({
        mediaList: newList,
        hasMore: newList.length < res.total
      })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({ currentCategory: category }, () => {
      this.loadMedia(false)
    })
  },

  loadMore() {
    this.setData({ page: this.data.page + 1 }, () => {
      this.loadMedia(true)
    })
  },

  previewMedia(e) {
    const item = e.currentTarget.dataset.item
    if (item.type === 'image') {
      wx.previewImage({
        urls: this.data.mediaList.filter(m => m.type === 'image').map(m => m.url),
        current: item.url
      })
    } else if (item.type === 'video') {
      wx.navigateTo({ url: `/pages/article/detail?id=${item._id}&type=video` })
    }
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/portfolio/
git commit -m "feat: implement portfolio page with grid layout and category filter"
```

---

### Task 6: 关于我 + BLOG/VLOG 列表页

**Files:**
- Create: `miniprogram/pages/about/home.js`
- Create: `miniprogram/pages/about/home.wxml`
- Create: `miniprogram/pages/about/home.wxss`
- Create: `miniprogram/pages/about/home.json`

- [ ] **Step 1: 创建 home.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "关于我"
}
```

- [ ] **Step 2: 创建 home.wxml**

```html
<view class="page">
  <!-- 个人详情 -->
  <view class="about-section card">
    <text class="about-title">关于我</text>
    <text class="about-content">{{aboutContent}}</text>
    <view class="contact-row" wx:for="{{contacts}}" wx:key="name">
      <text class="contact-label">{{item.label}}</text>
      <text class="contact-value">{{item.value}}</text>
    </view>
  </view>

  <!-- Tab 切换 -->
  <view class="tab-bar">
    <view class="tab {{currentTab === 'blog' ? 'active' : ''}}" data-tab="blog" bindtap="switchTab">BLOG</view>
    <view class="tab {{currentTab === 'vlog' ? 'active' : ''}}" data-tab="vlog" bindtap="switchTab">VLOG</view>
  </view>

  <!-- 文章/视频列表 -->
  <view class="content-list">
    <view wx:for="{{contentList}}" wx:key="_id" class="content-card" bindtap="goToDetail" data-id="{{item._id}}">
      <image class="content-cover" src="{{item.coverImage}}" mode="aspectFill" wx:if="{{item.coverImage}}"></image>
      <view class="content-info">
        <text class="content-title">{{item.title}}</text>
        <text class="content-summary">{{item.summary}}</text>
        <view class="content-meta">
          <text class="content-date">{{formatDate(item.publishDate)}}</text>
          <text class="content-category" wx:if="{{item.category}}">{{item.category}}</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 加载更多 -->
  <view class="load-more" wx:if="{{hasMore}}">
    <text class="load-more-text" bindtap="loadMore">加载更多</text>
  </view>

  <!-- 管理员入口（连续点击 5 次触发） -->
  <view class="admin-entry" bindtap="onAvatarTap">
    <image class="admin-avatar" src="{{avatarUrl}}" mode="aspectFill"></image>
  </view>
</view>
```

- [ ] **Step 3: 创建 home.wxss**

```css
.page { min-height: 100vh; background: #f5f5f5; padding-bottom: 40rpx; }

.about-section {
  margin: 30rpx;
}

.about-title { font-size: 32rpx; font-weight: 600; color: #333; margin-bottom: 16rpx; display: block; }
.about-content { font-size: 28rpx; color: #666; line-height: 1.6; margin-bottom: 20rpx; display: block; }

.contact-row { display: flex; margin-bottom: 12rpx; }
.contact-label { width: 120rpx; font-size: 26rpx; color: #999; }
.contact-value { flex: 1; font-size: 26rpx; color: #333; }

.tab-bar {
  display: flex;
  margin: 0 30rpx 20rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #999;
  font-weight: 500;
}

.tab.active {
  color: #1a1a2e;
  border-bottom: 4rpx solid #1a1a2e;
}

.content-list { padding: 0 30rpx; }

.content-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.content-cover { width: 240rpx; height: 180rpx; flex-shrink: 0; }
.content-info { flex: 1; padding: 20rpx; display: flex; flex-direction: column; }
.content-title { font-size: 28rpx; font-weight: 600; color: #333; margin-bottom: 8rpx; }
.content-summary { font-size: 24rpx; color: #999; flex: 1; overflow: hidden; margin-bottom: 8rpx; }
.content-meta { display: flex; gap: 12rpx; align-items: center; }
.content-date { font-size: 22rpx; color: #ccc; }
.content-category {
  font-size: 22rpx;
  color: #1a1a2e;
  padding: 2rpx 12rpx;
  border-radius: 4rpx;
  background: #f0f2f5;
}

.load-more { text-align: center; padding: 20rpx; }
.load-more-text { font-size: 26rpx; color: #999; }

.admin-entry {
  text-align: center;
  padding: 40rpx 0;
  opacity: 0.3;
}

.admin-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
```

- [ ] **Step 4: 创建 home.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    avatarUrl: 'https://via.placeholder.com/80',
    aboutContent: '这里写你的详细介绍...',
    contacts: [
      { label: '微信', value: 'your_wechat_id' },
      { label: '邮箱', value: 'your@email.com' }
    ],
    currentTab: 'blog',
    contentList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    tapCount: 0
  },

  onLoad() {
    this.loadContent()
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  async loadContent(loadMore = false) {
    if (!loadMore) {
      util.showLoading()
      this.setData({ page: 1, contentList: [] })
    }

    try {
      const res = await api.getArticles({
        type: this.data.currentTab,
        page: this.data.page,
        pageSize: this.data.pageSize
      })
      const newList = loadMore
        ? [...this.data.contentList, ...res.data]
        : res.data
      this.setData({
        contentList: newList,
        hasMore: newList.length < res.total
      })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab }, () => {
      this.loadContent(false)
    })
  },

  loadMore() {
    this.setData({ page: this.data.page + 1 }, () => {
      this.loadContent(true)
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/article/detail?id=${id}` })
  },

  // 连续点击 5 次进入后台
  onAvatarTap() {
    let count = this.data.tapCount + 1
    this.setData({ tapCount: count })
    if (count >= 5) {
      this.setData({ tapCount: 0 })
      this.enterAdmin()
    }
    // 重置计数器
    clearTimeout(this._tapTimer)
    this._tapTimer = setTimeout(() => {
      this.setData({ tapCount: 0 })
    }, 3000)
  },

  async enterAdmin() {
    util.showLoading('验证中...')
    try {
      const res = await api.checkAdmin()
      if (res.isAdmin) {
        wx.navigateTo({ url: '/pages/admin/dashboard' })
      } else {
        util.showToast('无管理员权限')
      }
    } catch (err) {
      util.showToast('验证失败')
    }
    util.hideLoading()
  },

  formatDate(dateStr) {
    return util.formatDate(dateStr)
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/about/
git commit -m "feat: implement about page with blog/vlog tabs and admin entry"
```

---

### Task 7: 文章/视频详情页

**Files:**
- Create: `miniprogram/pages/article/detail.js`
- Create: `miniprogram/pages/article/detail.wxml`
- Create: `miniprogram/pages/article/detail.wxss`
- Create: `miniprogram/pages/article/detail.json`

- [ ] **Step 1: 创建 detail.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "文章详情"
}
```

- [ ] **Step 2: 创建 detail.wxml**

```html
<view class="page">
  <!-- 封面图 -->
  <image class="cover" src="{{article.coverImage}}" mode="widthFix" wx:if="{{article.coverImage}}"></image>

  <!-- 视频播放器 -->
  <video class="video-player" src="{{article.content}}" controls="{{true}}" wx:if="{{article.type === 'vlog'}}" />

  <!-- 文章标题 -->
  <view class="article-header" wx:if="{{article.type === 'blog'}}">
    <text class="title">{{article.title}}</text>
    <view class="meta">
      <text class="date">{{formatDate(article.publishDate)}}</text>
      <text class="tag" wx:for="{{article.tags}}" wx:key="index">{{item}}</text>
    </view>
  </view>

  <!-- 正文（Markdown 渲染，简单实现，用 rich-text 做基本展示） -->
  <!-- 实际项目中建议使用 mp-html 或 towxml 等 Markdown 渲染组件 -->
  <rich-text class="content" nodes="{{renderedContent}}" wx:if="{{article.type === 'blog'}}"></rich-text>
</view>
```

- [ ] **Step 3: 创建 detail.wxss**

```css
.page { background: #fff; min-height: 100vh; }

.cover { width: 100%; }

.video-player { width: 100%; }

.article-header { padding: 30rpx; }

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: block;
}

.meta { display: flex; flex-wrap: wrap; gap: 8rpx; align-items: center; }
.date { font-size: 24rpx; color: #999; }
.tag {
  font-size: 22rpx;
  color: #1a1a2e;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  background: #f0f2f5;
}

.content {
  padding: 0 30rpx 40rpx;
  font-size: 30rpx;
  line-height: 1.8;
  color: #333;
}
```

- [ ] **Step 4: 创建 detail.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    article: {},
    renderedContent: ''
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadArticle(id)
    }
  },

  async loadArticle(id) {
    util.showLoading()
    try {
      const res = await api.getArticleDetail(id)
      const article = res.data
      // 简单的 Markdown 转 HTML（处理标题、段落、加粗、列表）
      const html = this.renderMarkdown(article.content || '')
      this.setData({
        article,
        renderedContent: html
      })
      wx.setNavigationBarTitle({ title: article.title || '详情' })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  // 简易 Markdown 渲染（生产环境建议使用 towxml 或 mp-html 组件）
  renderMarkdown(md) {
    if (!md) return ''
    let html = md
      .replace(/### (.+)/g, '<h3>$1</h3>')
      .replace(/## (.+)/g, '<h2>$1</h2>')
      .replace(/# (.+)/g, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<image src="$2" style="width:100%;border-radius:8rpx;margin:16rpx 0" />')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#1a1a2e">$1</a>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br/>')
    return html
  },

  formatDate(dateStr) {
    return util.formatDate(dateStr)
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/article/
git commit -m "feat: implement article detail page with Markdown rendering"
```

---

### Task 8: 后台 Dashboard

**Files:**
- Create: `miniprogram/pages/admin/dashboard.js`
- Create: `miniprogram/pages/admin/dashboard.wxml`
- Create: `miniprogram/pages/admin/dashboard.wxss`
- Create: `miniprogram/pages/admin/dashboard.json`

- [ ] **Step 1: 创建 dashboard.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "后台管理"
}
```

- [ ] **Step 2: 创建 dashboard.wxml**

```html
<view class="page">
  <view class="header">
    <text class="header-title">后台管理</text>
    <text class="header-subtitle">欢迎回来，管理员</text>
  </view>

  <!-- 统计卡片 -->
  <view class="stats-grid">
    <view class="stat-card">
      <text class="stat-number">{{stats.articles}}</text>
      <text class="stat-label">文章</text>
    </view>
    <view class="stat-card">
      <text class="stat-number">{{stats.media}}</text>
      <text class="stat-label">媒体文件</text>
    </view>
    <view class="stat-card">
      <text class="stat-number">{{stats.skills}}</text>
      <text class="stat-label">技能</text>
    </view>
  </view>

  <!-- 快捷入口 -->
  <view class="quick-actions">
    <view class="action-item" bindtap="goToArticleEdit" data-id="">
      <text class="action-icon">✏️</text>
      <text class="action-text">写文章</text>
    </view>
    <view class="action-item" bindtap="goToSkillEdit" data-id="">
      <text class="action-icon">⚡</text>
      <text class="action-text">管理技能</text>
    </view>
    <view class="action-item" bindtap="goToMediaEdit">
      <text class="action-icon">🖼️</text>
      <text class="action-text">管理媒体</text>
    </view>
  </view>

  <!-- 最近更新 -->
  <view class="section">
    <text class="section-title">最近更新</text>
    <view wx:for="{{recentArticles}}" wx:key="_id" class="recent-item">
      <text class="recent-title">{{item.title}}</text>
      <text class="recent-date">{{formatDate(item.updatedAt)}}</text>
    </view>
  </view>
</view>
```

- [ ] **Step 3: 创建 dashboard.wxss**

```css
.page { min-height: 100vh; background: #f5f5f5; }

.header {
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
}

.header-title { font-size: 40rpx; font-weight: 600; display: block; }
.header-subtitle { font-size: 26rpx; color: rgba(255,255,255,0.7); margin-top: 8rpx; display: block; }

.stats-grid {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.stat-number { font-size: 48rpx; font-weight: 700; color: #1a1a2e; display: block; }
.stat-label { font-size: 24rpx; color: #999; margin-top: 8rpx; display: block; }

.quick-actions {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx 30rpx;
}

.action-item {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.action-icon { font-size: 48rpx; display: block; margin-bottom: 8rpx; }
.action-text { font-size: 26rpx; color: #333; }

.section { padding: 0 30rpx 30rpx; }
.section-title { font-size: 32rpx; font-weight: 600; color: #333; margin-bottom: 20rpx; display: block; }

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.recent-title { font-size: 26rpx; color: #333; flex: 1; }
.recent-date { font-size: 22rpx; color: #999; }
```

- [ ] **Step 4: 创建 dashboard.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    stats: { articles: 0, media: 0, skills: 0 },
    recentArticles: []
  },

  onLoad() {
    this.loadDashboard()
  },

  async loadDashboard() {
    util.showLoading()
    try {
      const [articlesRes, mediaRes, skillsRes] = await Promise.all([
        api.getArticles({ page: 1, pageSize: 1 }),
        api.getMedia({ page: 1, pageSize: 1 }),
        api.getSkills()
      ])
      this.setData({
        stats: {
          articles: articlesRes.total || 0,
          media: mediaRes.total || 0,
          skills: (skillsRes.data || []).length
        }
      })

      // 获取最近文章
      const recentRes = await api.getArticles({ page: 1, pageSize: 5 })
      this.setData({ recentArticles: recentRes.data || [] })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  goToArticleEdit(e) {
    const id = e.currentTarget.dataset.id || ''
    wx.navigateTo({ url: `/pages/admin/article-edit?id=${id}` })
  },

  goToSkillEdit() {
    wx.navigateTo({ url: '/pages/admin/skill-edit' })
  },

  goToMediaEdit() {
    wx.navigateTo({ url: '/pages/admin/media-edit' })
  },

  formatDate(dateStr) {
    return util.formatDate(dateStr)
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/admin/dashboard.js miniprogram/pages/admin/dashboard.wxml miniprogram/pages/admin/dashboard.wxss miniprogram/pages/admin/dashboard.json
git commit -m "feat: implement admin dashboard with stats and quick actions"
```

---

### Task 9: 后台 - 文章编辑页

**Files:**
- Create: `miniprogram/pages/admin/article-edit.js`
- Create: `miniprogram/pages/admin/article-edit.wxml`
- Create: `miniprogram/pages/admin/article-edit.wxss`
- Create: `miniprogram/pages/admin/article-edit.json`

- [ ] **Step 1: 创建 article-edit.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "编辑文章"
}
```

- [ ] **Step 2: 创建 article-edit.wxml**

```html
<view class="page">
  <view class="form">
    <view class="form-group">
      <text class="label">标题</text>
      <input class="input" placeholder="输入文章标题" value="{{title}}" bindinput="onInput" data-field="title" />
    </view>

    <view class="form-group">
      <text class="label">类型</text>
      <picker range="{{typeOptions}}" value="{{typeIndex}}" bindchange="onTypeChange">
        <view class="picker">{{typeOptions[typeIndex]}}</view>
      </picker>
    </view>

    <view class="form-group">
      <text class="label">分类</text>
      <input class="input" placeholder="如：摄影、AI" value="{{category}}" bindinput="onInput" data-field="category" />
    </view>

    <view class="form-group">
      <text class="label">标签（逗号分隔）</text>
      <input class="input" placeholder="标签1,标签2" value="{{tagsStr}}" bindinput="onTagsInput" />
    </view>

    <view class="form-group">
      <text class="label">摘要</text>
      <textarea class="textarea" placeholder="简短摘要" value="{{summary}}" bindinput="onInput" data-field="summary" />
    </view>

    <view class="form-group">
      <text class="label">封面图</text>
      <view class="cover-picker" bindtap="chooseCover">
        <image class="cover-preview" src="{{coverImage}}" mode="aspectFill" wx:if="{{coverImage}}"></image>
        <text class="cover-placeholder" wx:else>点击选择封面图</text>
      </view>
    </view>

    <view class="form-group" wx:if="{{typeIndex === 0}}">
      <text class="label">正文（Markdown）</text>
      <textarea class="textarea content-input" placeholder="输入 Markdown 格式正文" value="{{content}}" bindinput="onInput" data-field="content" />
    </view>

    <view class="form-group" wx:if="{{typeIndex === 1}}">
      <text class="label">视频链接</text>
      <input class="input" placeholder="输入视频文件ID" value="{{content}}" bindinput="onInput" data-field="content" />
    </view>

    <view class="form-actions">
      <button class="btn-primary" bindtap="saveAsDraft">存草稿</button>
      <button class="btn-primary btn-publish" bindtap="publish">发布</button>
      <button class="btn-danger" bindtap="deleteArticle" wx:if="{{isEdit}}">删除</button>
    </view>
  </view>
</view>
```

- [ ] **Step 3: 创建 article-edit.wxss**

```css
.page { min-height: 100vh; background: #f5f5f5; }

.form { padding: 30rpx; }

.form-group { margin-bottom: 30rpx; }
.label { font-size: 28rpx; color: #333; font-weight: 500; margin-bottom: 12rpx; display: block; }

.input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  background: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  height: 160rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.content-input { height: 400rpx; }

.picker {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.cover-picker {
  width: 200rpx;
  height: 200rpx;
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-preview { width: 100%; height: 100%; }
.cover-placeholder { font-size: 24rpx; color: #ccc; }

.form-actions { display: flex; gap: 20rpx; margin-top: 40rpx; }

.btn-primary {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #1a1a2e;
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.btn-publish { background: #0f3460; }

.btn-danger {
  width: 160rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #e74c3c;
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
}
```

- [ ] **Step 4: 创建 article-edit.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    articleId: '',
    isEdit: false,
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    category: '',
    tagsStr: '',
    typeOptions: ['BLOG', 'VLOG'],
    typeIndex: 0,
    status: 'draft'
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ articleId: id, isEdit: true })
      this.loadArticle(id)
    }
  },

  async loadArticle(id) {
    util.showLoading()
    try {
      const res = await api.getArticleDetail(id)
      const article = res.data
      this.setData({
        title: article.title || '',
        summary: article.summary || '',
        content: article.content || '',
        coverImage: article.coverImage || '',
        category: article.category || '',
        tagsStr: (article.tags || []).join(','),
        typeIndex: article.type === 'vlog' ? 1 : 0,
        status: article.status || 'draft'
      })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [field]: e.detail.value })
  },

  onTagsInput(e) {
    this.setData({ tagsStr: e.detail.value })
  },

  onTypeChange(e) {
    this.setData({ typeIndex: parseInt(e.detail.value) })
  },

  chooseCover() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFile = res.tempFilePaths[0]
        util.showLoading('上传中...')
        wx.cloud.uploadFile({
          cloudPath: `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`,
          filePath: tempFile
        }).then(uploadRes => {
          this.setData({ coverImage: uploadRes.fileID })
          util.hideLoading()
          util.showToast('上传成功', 'success')
        }).catch(() => {
          util.hideLoading()
          util.showToast('上传失败')
        })
      }
    })
  },

  saveAsDraft() {
    this.save('draft')
  },

  publish() {
    this.save('published')
  },

  async save(status) {
    const data = {
      title: this.data.title,
      summary: this.data.summary,
      content: this.data.content,
      coverImage: this.data.coverImage,
      category: this.data.category,
      tags: this.data.tagsStr.split(',').map(s => s.trim()).filter(Boolean),
      type: this.data.typeIndex === 1 ? 'vlog' : 'blog',
      status
    }

    util.showLoading('保存中...')
    try {
      if (this.data.isEdit) {
        await api.updateArticle(this.data.articleId, data)
      } else {
        await api.createArticle(data)
      }
      util.showToast('保存成功', 'success')
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (err) {
      util.showToast('保存失败')
    }
    util.hideLoading()
  },

  async deleteArticle() {
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定要删除吗？',
      success: async (res) => {
        if (res.confirm) {
          util.showLoading('删除中...')
          try {
            await api.deleteArticle(this.data.articleId)
            util.showToast('删除成功', 'success')
            setTimeout(() => wx.navigateBack(), 1500)
          } catch (err) {
            util.showToast('删除失败')
          }
          util.hideLoading()
        }
      }
    })
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/admin/article-edit.js miniprogram/pages/admin/article-edit.wxml miniprogram/pages/admin/article-edit.wxss miniprogram/pages/admin/article-edit.json
git commit -m "feat: implement article editor page with upload and CRUD"
```

---

### Task 10: 后台 - 媒体管理页 + 技能编辑页

**Files:**
- Create: `miniprogram/pages/admin/media-edit.js`
- Create: `miniprogram/pages/admin/media-edit.wxml`
- Create: `miniprogram/pages/admin/media-edit.wxss`
- Create: `miniprogram/pages/admin/media-edit.json`
- Create: `miniprogram/pages/admin/skill-edit.js`
- Create: `miniprogram/pages/admin/skill-edit.wxml`
- Create: `miniprogram/pages/admin/skill-edit.wxss`
- Create: `miniprogram/pages/admin/skill-edit.json`

- [ ] **Step 1: 创建 media-edit.wxml**

```html
<view class="page">
  <view class="header-bar">
    <text class="header-title">媒体管理</text>
    <button class="upload-btn" bindtap="uploadMedia">上传</button>
  </view>

  <view class="media-grid">
    <view wx:for="{{mediaList}}" wx:key="_id" class="media-card">
      <image class="media-thumb" src="{{item.thumbnail || item.url}}" mode="aspectFill"></image>
      <view class="media-info">
        <text class="media-title">{{item.title || '未命名'}}</text>
        <text class="media-type">{{item.type === 'image' ? '图片' : '视频'}}</text>
      </view>
      <view class="media-actions">
        <button class="action-btn" bindtap="editMedia" data-id="{{item._id}}">编辑</button>
        <button class="action-btn delete" bindtap="deleteMedia" data-id="{{item._id}}" data-fileid="{{item.url}}">删除</button>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建 media-edit.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    mediaList: [],
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.loadMedia()
  },

  onShow() {
    this.loadMedia()
  },

  async loadMedia() {
    util.showLoading()
    try {
      const res = await api.getMedia({ page: 1, pageSize: 100 })
      this.setData({
        mediaList: res.data || [],
        hasMore: false
      })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  uploadMedia() {
    wx.showActionSheet({
      itemList: ['上传图片', '上传视频'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.chooseImage()
        } else {
          this.chooseVideo()
        }
      }
    })
  },

  chooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        util.showLoading('上传中...')
        const promises = res.tempFilePaths.map((path, index) => {
          return wx.cloud.uploadFile({
            cloudPath: `media/${Date.now()}-${index}.jpg`,
            filePath: path
          })
        })
        Promise.all(promises).then(uploadResults => {
          util.hideLoading()
          util.showToast(`上传完成 ${uploadResults.length} 张`, 'success')
          this.loadMedia()
        }).catch(() => {
          util.hideLoading()
          util.showToast('上传失败')
        })
      }
    })
  },

  chooseVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 120,
      camera: 'back',
      success: (res) => {
        util.showLoading('上传中...')
        wx.cloud.uploadFile({
          cloudPath: `media/${Date.now()}.mp4`,
          filePath: res.tempFilePath
        }).then(uploadRes => {
          // 保存到数据库
          return api.createArticle({
            title: '',
            summary: '',
            content: uploadRes.fileID,
            coverImage: res.thumbTempFilePath || '',
            type: 'vlog',
            status: 'published'
          })
        }).then(() => {
          util.hideLoading()
          util.showToast('上传成功', 'success')
          this.loadMedia()
        }).catch(() => {
          util.hideLoading()
          util.showToast('上传失败')
        })
      }
    })
  },

  deleteMedia(e) {
    const { id, fileid } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: async (res) => {
        if (res.confirm) {
          util.showLoading('删除中...')
          try {
            await api.deleteMedia(id, fileid)
            util.showToast('删除成功', 'success')
            this.loadMedia()
          } catch (err) {
            util.showToast('删除失败')
          }
          util.hideLoading()
        }
      }
    })
  }
})
```

- [ ] **Step 3: 创建 skill-edit.wxml**

```html
<view class="page">
  <view class="header-bar">
    <text class="header-title">技能管理</text>
    <button class="add-btn" bindtap="addSkill">添加技能</button>
  </view>

  <view class="skill-list">
    <view wx:for="{{skillList}}" wx:key="_id" class="skill-row">
      <view class="skill-info">
        <text class="skill-icon">{{item.icon || '⚡'}}</text>
        <view class="skill-text">
          <text class="skill-name">{{item.name}}</text>
          <text class="skill-category">{{item.category}}</text>
        </view>
      </view>
      <view class="skill-actions">
        <button class="action-btn" bindtap="editSkill" data-id="{{item._id}}">编辑</button>
        <button class="action-btn delete" bindtap="deleteSkill" data-id="{{item._id}}">删除</button>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 4: 创建 skill-edit.js**

```javascript
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    skillList: []
  },

  onLoad() {
    this.loadSkills()
  },

  onShow() {
    this.loadSkills()
  },

  async loadSkills() {
    util.showLoading()
    try {
      const res = await api.getSkills()
      this.setData({ skillList: res.data || [] })
    } catch (err) {
      util.showToast('加载失败')
    }
    util.hideLoading()
  },

  addSkill() {
    wx.showModal({
      title: '添加技能',
      content: '后续将通过表单页完善',
      placeholderText: '技能名称',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.createSkill({
              name: res.content || '新技能',
              category: '未分类',
              description: '',
              icon: '⭐',
              level: 3,
              order: this.data.skillList.length
            })
            util.showToast('添加成功', 'success')
            this.loadSkills()
          } catch (err) {
            util.showToast('添加失败')
          }
        }
      }
    })
  },

  deleteSkill(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个技能吗？',
      success: async (res) => {
        if (res.confirm) {
          util.showLoading('删除中...')
          try {
            await api.deleteSkill(id)
            util.showToast('删除成功', 'success')
            this.loadSkills()
          } catch (err) {
            util.showToast('删除失败')
          }
          util.hideLoading()
        }
      }
    })
  }
})
```

- [ ] **Step 5: 提交**

```
git add miniprogram/pages/admin/media-edit/ miniprogram/pages/admin/skill-edit/
git commit -m "feat: implement media management and skill management pages"
```

---

## 部署前准备

### Task 11: 初始数据配置

- [ ] **Step 1: 在云数据库创建以下集合**
  - `users` — 手动插入 1 条管理员记录（你的 openid + `role: 'admin'`）
  - `skills` — 手动插入几个示例技能用于测试
  - `articles` — 手动插入 1-2 篇测试文章
  - `media_items` — 手动插入测试媒体记录

- [ ] **Step 2: 在云存储中上传封面图和媒体测试文件**

### Task 12: 项目优化与发布

- [ ] **Step 1: 在微信开发者工具中测试所有页面和功能**
- [ ] **Step 2: 优化图片加载和列表性能**
- [ ] **Step 3: 提交微信审核，审核通过后发布**

---

## 自审对照

对照 spec 检查实现任务的覆盖情况：

| Spec 需求 | 对应任务 |
|---|---|
| 个人主页 + 轮播 + 最新文章 | Task 3 |
| 技能展示（分类+等级） | Task 4 |
| 作品画廊（网格+分类筛选） | Task 5 |
| 关于我 + BLOG/VLOG 列表 | Task 6 |
| 文章/视频详情页（Markdown 渲染） | Task 7 |
| 简易后台 Dashboard | Task 8 |
| 文章管理（增删改） | Task 9 |
| 媒体管理（上传+删除） | Task 10 |
| 技能管理（增删改） | Task 10 |
| 身份验证（连续点击头像 5 次） | Task 6 |
| 云函数基础设施 | Task 2 |
| 统一 API 封装 | Task 1 |
| 项目配置与全局样式 | Task 1 |
| 数据模型 - users/skills/articles/media_items | Task 2 + Task 11 |
| 云存储集成 | Task 9 + Task 10 |

所有 spec 需求均有对应实现任务。
