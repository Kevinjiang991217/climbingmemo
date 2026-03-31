# 攀岩账本 - 微信小程序开发计划

## 1. 项目概述

- **项目名称**：攀岩账本
- **类型**：微信小程序
- **核心功能**：记录攀岩线路、分析个人数据、管理攀岩装备
- **存储方式**：本地存储（云端功能后续考虑）

---

## 2. 功能需求

### 2.1 线路记录

| 字段 | 选项 |
|------|------|
| 攀岩类型 | 抱石、运动攀登、传统攀登、顶绳攀登、先锋攀登 |
| 难度等级 | 抱石：V0-V17 / 其他：YDS(5.5-5.15d) 或 法式(5a-9c) |
| 岩点类型 | Mantle(掌压)、Jug(大把手点)、Crimp(抠点)、Sloper(斜面点)、Pinch(捏点)、Pocket(洞点)、Gaston(反抓手)、Undercling(反抠) |
| 线路风格 | 动态、静态、平衡线 |
| 墙面风格 | 面攀、裂缝攀登、平板、垂直壁、悬岩/屋檐、刃脊、内角、烟囱 |
| 场馆 | 选填（文本输入） |
| 日期 | 自动记录 |

### 2.2 个人数据汇总

- **难度趋势**：按时间展示攀爬难度变化折线图
- **岩点分析**：
  - 擅长岩点类型（使用频率高且成功率高的）
  - 薄弱岩点类型（使用频率高但成功率低的）

### 2.3 装备记录

- 添加/编辑/删除常用装备
- 装备类别：攀岩鞋、镁粉、绳索、锁具、扁带、安全带、头盔、其他

---

## 3. 交互设计

### 方案C：首页 + 弹窗/抽屉

- **首页**：线路记录主界面
  - 顶部：个人汇总卡片（最近线路、擅长岩点）
  - 中部：线路记录表单
  - 底部：线路历史列表
  - 右下角：浮动按钮（展开菜单）

- **右下角菜单**（点击展开）：
  - 装备管理
  - 全局统计（占位，后续云端实现）
  - 设置

---

## 4. 数据结构

### 4.1 线路记录 (routes)

```typescript
interface Route {
  id: string;
  type: 'bouldering' | 'sport' | 'trad' | 'toprope' | 'lead';
  difficulty: string;        // V0-V17 或 5.5-5.15d 或 5a-9c
  difficultySystem: 'v' | 'yds' | 'french';
  holds: string[];          // 岩点类型数组
  style: 'dynamic' | 'static' | 'balance';
  wallStyle: string;        // 墙面风格
  gym: string;              // 场馆（可选）
  date: number;             // 时间戳
  success: boolean;         // 是否成功
}
```

### 4.2 装备 (equipment)

```typescript
interface Equipment {
  id: string;
  name: string;
  category: 'shoes' | 'chalk' | 'rope' | 'quickdraw' | 'trad' | 'harness' | 'helmet' | 'other';
  purchaseDate?: number;
  notes?: string;
}
```

---

## 5. 开发步骤

### 第一阶段：基础框架
1. 创建小程序项目结构
2. 配置 app.json（页面、导航栏）
3. 实现本地存储工具类

### 第二阶段：核心功能
1. 开发首页线路记录表单
2. 实现线路历史列表
3. 添加线路保存/删除功能

### 第三阶段：数据汇总
1. 计算难度趋势数据
2. 分析岩点类型（擅长/薄弱）
3. 展示个人汇总卡片

### 第四阶段：装备管理
1. 创建设备管理页面/弹窗
2. 实现装备 CRUD 操作
3. 常用装备快速添加

### 第五阶段：优化
1. 样式美化
2. 用户体验优化
3. 测试与修复

---

## 6. 页面结构

```
pages/
  index/
    index.wxml      // 首页（线路记录 + 历史）
    index.wxss
    index.ts
  equipment/
    equipment.wxml  // 装备管理
    equipment.wxss
    equipment.ts
components/
  routeForm/        // 线路表单组件
  routeList/        // 线路列表组件
  summaryCard/      // 汇总卡片组件
  bottomMenu/      // 底部菜单组件
utils/
  storage.ts        // 本地存储
  analysis.ts       // 数据分析
  constants.ts      // 常量定义
```

---

## 7. 待定/后续功能

- 云端存储
- 全局用户统计
- 微信登录
- 数据导出/导入
