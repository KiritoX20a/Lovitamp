# 微信个人品牌展示小程序 - 设计文档

## 概述

一个基于微信原生框架 + 微信云开发的个人品牌展示小程序，面向自己、朋友及潜在雇主客户。涵盖个人技能展示、图文/视频作品集、博客与视频日志，以及简易后台管理。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | 微信原生小程序框架（WXML + WXSS + JavaScript） |
| 后端 | 微信云开发（云函数 + 云数据库 + 云存储） |
| 数据库 | 云数据库（MongoDB-like） |
| 文件存储 | 云存储（图片、视频文件） |
| 账号体系 | 微信 OpenID |

**选型理由：** 个人展示类小程序功能明确、流量低，云开发的免费额度足够覆盖需求。零运维，开发周期短。

---

## 受众定位

- **自己** — 个人品牌管理和沉淀
- **朋友** — 了解近况和作品
- **潜在雇主/客户** — 查看技能和作品集

---

## 功能模块

### 前端（访客可见）

#### 1. 个人主页
- 头像、昵称、一句话个人简介
- 社交媒体链接（微信、GitHub、微博等）
- 顶部精选轮播（精选图片/精选作品）
- 最近文章/视频预览（2-3条）

#### 2. 技能展示
- 按领域分类：AI、摄影、健身、户外越野、剪辑、修图等
- 每项技能展示：名称、描述、等级/熟练度（1-5星）、自定义图标
- 支持排序（后台管理配置顺序）

#### 3. 作品画廊
- 图片与视频混排，瀑布流/网格布局
- 点击放大查看图片
- 视频支持内嵌播放
- 按分类/标签筛选

#### 4. 关于我 + BLOG/VLOG
- 详细的个人介绍页
- BLOG列表：图文文章，支持分类和标签
- VLOG列表：视频日志，同样支持分类
- 文章/视频详情页：完整内容展示，正文使用 Markdown 渲染

### 后台管理（仅管理员可见）

#### 1. 身份验证
- 通过微信 OpenID 判断管理员身份
- 入口在"关于我"页面底部，连续点击头像 5 次触发验证
- 验证通过后跳转后台 Dashboard

#### 2. Dashboard
- 统计概览：文章数、媒体数、技能数
- 最近更新内容列表（最新 5 条）

#### 3. 文章管理
- 列表页（分页）：查看/编辑/删除
- 新建/编辑页：标题、正文（Markdown）、封面图（从手机相册选择上传）、分类、标签

#### 4. 媒体管理
- 网格列表展示已上传文件（分页）
- 上传：从手机相册选择图片/视频，自动上传至云存储
- 编辑标题、描述、分类
- 删除媒体文件

#### 5. 技能管理
- 技能列表：增删改
- 编辑：名称、描述、分类、排序、熟练度（1-5）

---

## 页面结构

### 底部 Tab 导航（4 个）

```
首页（pages/index/home）
技能（pages/skills/home）
作品集（pages/portfolio/home）
关于我（pages/about/home）
```

### 子页面

```
pages/article/detail       — 文章/视频详情页（?id=xxx）
pages/article/edit         — 后台：新建/编辑文章（?id=xxx，无id为新建）
pages/media/edit           — 后台：编辑媒体（?id=xxx）
pages/skill/edit           — 后台：编辑技能（?id=xxx）
pages/admin/dashboard      — 后台首页
```

---

## 数据模型

### users 集合

```json
{
  "_id": "string",
  "openid": "string（唯一）",
  "nickname": "string",
  "avatar": "string",
  "role": "visitor | admin",
  "createdAt": "date"
}
```

### skills 集合

```json
{
  "_id": "string",
  "category": "string（如"AI"、"摄影"）",
  "name": "string",
  "description": "string",
  "icon": "string",
  "level": "number（1-5）",
  "order": "number（排序权重，越小越靠前）",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### articles 集合

```json
{
  "_id": "string",
  "title": "string",
  "summary": "string",
  "content": "string（Markdown 格式）",
  "coverImage": "string（云存储 fileID）",
  "tags": ["string"],
  "category": "string",
  "type": "blog | vlog",
  "publishDate": "date",
  "status": "draft | published",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### media_items 集合

```json
{
  "_id": "string",
  "title": "string",
  "type": "image | video",
  "url": "string（云存储 fileID）",
  "thumbnail": "string",
  "description": "string",
  "category": "string",
  "sortOrder": "number",
  "createdAt": "date"
}
```

---

## 核心交互流程

### 前台浏览流程
1. 用户打开小程序，默认进入首页
2. 底部 Tab 切换各模块
3. 点击文章/视频卡片进入详情页
4. 详情页展示完整内容（Markdown 渲染为富文本）

### 后台管理流程
1. 在"关于我"页面连续点击头像 5 次
2. 提示验证身份，调用云函数 `checkAdmin`
3. 云函数获取当前用户的 openid，与数据库中的管理员记录比对
4. 验证通过 → 跳转到 admin/dashboard
5. 验证失败 → 提示无权限
6. 在后台各管理页面执行增删改操作
7. 所有写操作通过云函数执行，附带 openid 校验

---

## 部署与发布计划

1. 在[微信公众平台](https://mp.weixin.qq.com)注册小程序个人账号，完成基本信息填写
2. 在微信开发者工具中开通云开发，创建云开发环境
3. 本地开发完成，通过微信开发者工具上传代码
4. 提交微信审核（1-7个工作日），审核通过后发布

---

## 非功能需求

- 列表页图片懒加载，使用 `wx:for` + `lazy-load` 属性
- 云函数使用缓存减少数据库读取次数
- 后台敏感操作（删除文章/媒体）需二次确认
- 媒体文件上传限制：单张图片不超过 10MB，单个视频不超过 50MB
