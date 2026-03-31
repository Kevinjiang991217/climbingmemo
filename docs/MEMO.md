# 攀岩账本小程序开发备忘录

## 2024年对话记录

### 问题：历史记录中岩点类型文字不在tag中心

**问题描述**：
- 历史记录中的岩点类型 tag 标签，文字没有垂直居中

**修改文件**：
- `miniprogram/pages/index/index.less`

**修改内容**：
- `.hold-tag` 样式调整，最终版本：
  ```less
  .hold-tag {
    padding: 1px 6px 5px 6px;
    background: @bg-color;
    border-radius: 4px;
    font-size: 9px;
    color: @text-light;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  ```

**调整过程**：
1. 初始状态：使用 `inline-block` + `line-height` + `height` 方式，居中效果不好
2. 改为 `inline-flex` + `align-items: center` + `justify-content: center`
3. 通过调整 padding 上下比例（1px 上，5px 下）使文字垂直居中
4. `.history-holds` 的 `margin-bottom` 调整为 6px

---

### 修改攀岩类型

**修改内容**：
- 去掉：运动攀登（sport）、传统攀登（trad）
- 添加：自动绳降（autorope）

**修改文件**：
- `miniprogram/utils/constants.ts` - CLIMBING_TYPES 数组
- `miniprogram/pages/index/index.wxml` - 历史记录显示标签

---

### 添加Flash/Attempts功能

**修改内容**：

1. **Route 数据结构更新** (`utils/storage.ts`)：
   - `flash: boolean` - 是否Flash（一次成功）
   - `send: boolean` - 是否最终send
   - `attempts: number` - 尝试次数
   - `notes: string` - 备注（已有）

2. **表单更新** (`pages/index/index.wxml`)：
   - "是否成功" 改为 "是否Flash"
   - 非Flash时显示尝试次数输入
   - 添加备注输入框

3. **历史记录显示** (`pages/index/index.wxml`)：
   - 显示Flash/发送状态标签
   - 显示尝试次数
   - 未send的记录显示"Send"按钮
   - 显示备注内容

4. **统计分析更新** (`utils/analysis.ts`)：
   - `getTotalStats` 新增：flashCount, flashRate, avgAttempts
   - 新增 `getFlashRateByDifficulty` - 按难度统计flash率
   - 新增 `getAvgAttemptsByDifficulty` - 按难度统计平均尝试次数

5. **首页汇总卡片** (`pages/index/index.wxml`)：
   - 显示：总线路、Flash率、平均尝试

**待处理**：
- 需要处理旧数据的兼容性（无flash/send/attempts字段）

---

### 修改个人汇总展示

**修改内容**：

1. **汇总卡片布局更新** (`pages/index/index.wxml`)：
   - 第一行：总线路 / Flash率 / Flash次数
   - 第二行：抱石平均 / 绳攀平均
   - 擅长岩点 TOP3（用 / 分隔）
   - 去掉薄弱岩点

2. **统计数据更新** (`utils/analysis.ts`)：
   - `avgAttemptsBouldering` - 抱石平均尝试次数
   - `avgAttemptsRope` - 绳攀平均尝试次数（顶绳、先锋、自动绳降）

3. **历史记录** (`pages/index/index.ts`)：
   - 只展示最近5条记录

---

### 添加Project功能

**修改内容**：

1. **表单改动**：
   - 完攀状态选择：**Flash** / **已Send** / **Project**
   - 非Flash时显示尝试次数计数器
   - 保存按钮文字根据选择变化

2. **历史记录分区域**：
   - **Project区域**（优先展示）：显示未send的记录，带尝试次数计数器
   - **已完成区域**：显示已send的记录

3. **Project功能**：
   - 显示尝试次数 +/- 按钮
   - 点击 "Send" 可标记为已完成
   - 计数器从1开始

---

### 背景图片

**修改内容** (`pages/index/index.wxml`, `pages/index/index.less`)：
- 添加本地背景图片 `/images/BackGround.png`
- 使用 image 组件显示，透明度60%
- 图片放大1.5倍，覆盖更大范围

---

### 导航栏设计

**修改内容**：
- 移除导航栏白色背景和边框，改为透明
- 标题改为"攀岩手账"
- 使用圆角长方形按钮样式：
  - 紫色渐变背景
  - 圆角30px
  - 白色字体30px加粗
  - 带阴影效果

---

### 其他UI调整

- 场馆和备注输入框高度增加，方便点击
- 历史标题添加白色描边效果

---

### 待完善功能（参考 SPEC.md）

1. **首页UI重构** - 按SPEC方案C重新布局
   - 顶部：个人汇总卡片
   - 中部：线路记录表单
   - 底部：线路历史列表
   - 右下角：浮动菜单

2. **新增组件**：
   - `routeForm` - 线路表单组件
   - `routeList` - 线路列表组件
   - `summaryCard` - 汇总卡片组件
   - `bottomMenu` - 右下角浮动菜单组件

3. **设置页面** - 用户设置入口

---

### 数据可视化抽屉页

**修改内容**：

1. **新增分析函数** (`utils/analysis.ts`)：
   - `getStatsByClimbingType` - 按攀岩类型统计
   - 返回每种类型的：线路数、Send数、Flash数、Send率、Flash率、平均尝试次数、热门难度TOP3、岩点使用统计、线路风格统计、墙面风格统计

2. **新增统计页面** (`pages/stats/stats.*`)：
   - 总体概览卡片（总线路、已Send、Flash、Flash率、抱石/绳攀平均尝试）
   - 类型选择器（抱石、顶绳、先锋、自动绳降）
   - 选中类型的详细统计：
     - 数据卡片（线路数、已Send、Flash、Send率）- 可折叠
     - Flash率进度条
     - 平均尝试次数
     - 热门难度TOP3（带条形图）- 可折叠
     - 岩点使用统计（带条形图）- 可折叠
     - 线路风格统计（仅抱石）- 可折叠
     - 墙面风格统计 - 可折叠
   - 卡片默认收起（抱石数据展开）
   - 无数据时显示空状态提示

3. **菜单更新** (`pages/index/index.*`)：
   - 右下角菜单"全局统计"改为"数据统计"
   - 点击跳转统计页面

4. **页面样式统一**：
   - 装备页、统计页标题样式与主页统一（透明背景、白色大标题）
   - 所有卡片样式与主页统一（白色背景、12px圆角、16px内边距）
