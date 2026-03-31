// index.ts - 攀岩账本首页
import {
  CLIMBING_TYPES, V_GRADES, YDS_GRADES, FRENCH_GRADES,
  HOLD_TYPES, ROUTE_STYLES, WALL_STYLES
} from '../../utils/constants'
import { routeStorage, Route } from '../../utils/storage'
import { getTotalStats, analyzeStrengthsAndWeaknesses } from '../../utils/analysis'

Page({
  data: {
    // 攀岩类型选项
    climbingTypes: CLIMBING_TYPES,

    // 当前选择的值
    selectedType: 'bouldering',
    selectedDifficulty: 'V0',
    selectedDifficultySystem: 'v',
    selectedHolds: [] as string[],
    selectedStyle: 'dynamic',
    selectedWallStyle: 'face',
    gym: '',
    notes: '',
    // Flash相关
    isFlash: true,
    isProject: false, // 是否保存为Project
    attempts: 1,

    // 难度选项（根据类型动态变化）
    difficultyOptions: V_GRADES,
    difficultySystems: [
      { value: 'yds', label: 'YDS' },
      { value: 'french', label: '法式' },
    ],
    selectedSystem: 'yds',

    // 岩点选项（带选中状态）
    holdOptions: HOLD_TYPES,
    holdOptionsWithSelected: [] as { value: string; label: string; subLabel: string; selected: boolean }[],
    // 线路风格
    routeStyles: ROUTE_STYLES,
    // 墙面风格
    wallStyles: WALL_STYLES,

    // 线路历史
    routes: [] as Route[],

    // 个人统计
    stats: {
      totalRoutes: 0,
      successCount: 0,
      successRate: 0,
    },
    strengths: [] as { hold: string; label: string; subLabel: string; successRate: number; count: number }[],
    weaknesses: [] as { hold: string; label: string; subLabel: string; successRate: number; count: number }[],

    // 菜单显示
    showMenu: false,

    // 表单展开/收起
    showForm: true,
  },

  // 更新岩点选项的选中状态
  updateHoldOptions() {
    const selected = this.data.selectedHolds
    const updated = HOLD_TYPES.map((item: any) => ({
      value: item.value,
      label: item.label,
      subLabel: item.subLabel,
      selected: selected.includes(item.value),
    }))
    this.setData({ holdOptionsWithSelected: updated })
  },

  onLoad() {
    this.updateHoldOptions()
    this.loadRoutes()
  },

  onShow() {
    this.loadRoutes()
    this.updateHoldOptions()
  },

  // 加载线路数据
  loadRoutes() {
    const routes = routeStorage.getAll()

    // 已send的记录（取最近5条）
    const sentRoutes = routes.filter(r => r.send).slice(0, 5)
    // Project记录（取最近5条）
    const projectRoutes = routes.filter(r => !r.send).slice(0, 5)

    // 格式化日期
    const formattedSent = sentRoutes.map(r => ({
      ...r,
      formattedDate: this.formatDate(r.date),
    }))
    const formattedProjects = projectRoutes.map(r => ({
      ...r,
      formattedDate: this.formatDate(r.date),
    }))

    const stats = getTotalStats(routes)
    const { strengths } = analyzeStrengthsAndWeaknesses(routes)

    this.setData({
      routes: formattedSent,
      projects: formattedProjects,
      stats,
      strengths,
    })
  },

  // 选择攀岩类型
  onTypeChange(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.value

    let difficultyOptions = V_GRADES
    let selectedSystem = 'v'

    if (type === 'bouldering') {
      difficultyOptions = V_GRADES
      selectedSystem = 'v'
    } else {
      difficultyOptions = YDS_GRADES
      selectedSystem = 'yds'
    }

    this.setData({
      selectedType: type,
      selectedDifficulty: difficultyOptions[0],
      selectedDifficultySystem: selectedSystem,
      difficultyOptions,
      selectedSystem,
    })
  },

  // 选择难度等级
  onDifficultyChange(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      selectedDifficulty: e.currentTarget.dataset.value,
    })
  },

  // 切换难度体系
  onSystemChange(e: WechatMiniprogram.TouchEvent) {
    const system = e.currentTarget.dataset.value
    let difficultyOptions = YDS_GRADES

    if (system === 'yds') {
      difficultyOptions = YDS_GRADES
    } else {
      difficultyOptions = FRENCH_GRADES
    }

    this.setData({
      selectedSystem: system,
      selectedDifficultySystem: system,
      difficultyOptions,
      selectedDifficulty: difficultyOptions[0],
    })
  },

  // 选择岩点类型（多选）
  onHoldToggle(e: WechatMiniprogram.TouchEvent) {
    const hold = e.currentTarget.dataset.value
    let holds = [...this.data.selectedHolds]
    const index = holds.indexOf(hold)

    if (index > -1) {
      holds.splice(index, 1)
    } else {
      holds.push(hold)
    }

    this.setData({ selectedHolds: holds })
    this.updateHoldOptions()
  },

  // 选择线路风格
  onStyleChange(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      selectedStyle: e.currentTarget.dataset.value,
    })
  },

  // 选择墙面风格
  onWallStyleChange(e: WechatMiniprogram.TouchEvent) {
    this.setData({
      selectedWallStyle: e.currentTarget.dataset.value,
    })
  },

  // 输入场馆
  onGymInput(e: WechatMiniprogram.Input) {
    this.setData({
      gym: e.detail.value,
    })
  },

  // 切换到Flash
  onFlashToggle() {
    this.setData({
      isFlash: true,
      isProject: false,
      attempts: 1,
    })
  },

  // 切换到已Send
  onSendToggle() {
    this.setData({
      isFlash: false,
      isProject: false,
    })
  },

  // 切换到Project
  onProjectToggle() {
    this.setData({
      isFlash: false,
      isProject: true,
      attempts: 1,
    })
  },

  // 增加尝试次数
  onAttemptsIncrease() {
    this.setData({
      attempts: this.data.attempts + 1,
    })
  },

  // 减少尝试次数
  onAttemptsDecrease() {
    if (this.data.attempts > 1) {
      this.setData({
        attempts: this.data.attempts - 1,
      })
    }
  },

  // 备注输入
  onNotesInput(e: WechatMiniprogram.InputEvent) {
    this.setData({
      notes: e.detail.value,
    })
  },

  // 标记为Send
  onMarkSend(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    routeStorage.update(id, { send: true })
    this.loadRoutes()
    wx.showToast({
      title: '已标记Send',
      icon: 'success',
    })
  },

  // Project增加尝试次数
  onProjectAttemptsIncrease(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const project = this.data.projects.find(p => p.id === id)
    if (project) {
      routeStorage.update(id, { attempts: project.attempts + 1 })
      this.loadRoutes()
    }
  },

  // Project减少尝试次数
  onProjectAttemptsDecrease(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const project = this.data.projects.find(p => p.id === id)
    if (project && project.attempts > 1) {
      routeStorage.update(id, { attempts: project.attempts - 1 })
      this.loadRoutes()
    }
  },

  // Project标记为Send
  onProjectSend(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const project = this.data.projects.find(p => p.id === id)
    if (project) {
      routeStorage.update(id, { send: true })
      this.loadRoutes()
      wx.showToast({
        title: '已标记Send',
        icon: 'success',
      })
    }
  },

  // 保存线路
  onSaveRoute() {
    const isBouldering = this.data.selectedType === 'bouldering'
    const isProject = this.data.isProject
    const route = {
      type: this.data.selectedType,
      difficulty: this.data.selectedDifficulty,
      difficultySystem: this.data.selectedDifficultySystem,
      holds: this.data.selectedHolds,
      style: isBouldering ? this.data.selectedStyle : '', // 只有抱石记录线路风格
      wallStyle: this.data.selectedWallStyle,
      gym: this.data.gym,
      notes: this.data.notes,
      flash: this.data.isFlash,
      send: !isProject, // Project为未send，其他都是send
      attempts: this.data.isFlash ? 1 : this.data.attempts,
    }

    routeStorage.save(route)

    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })

    // 重置表单（保留类型选择）
    this.setData({
      selectedHolds: [],
      gym: '',
      notes: '',
      isFlash: true,
      isProject: false,
      attempts: 1,
    })

    // 重新加载数据
    this.loadRoutes()
  },

  // 删除线路
  onDeleteRoute(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          routeStorage.delete(id)
          this.loadRoutes()
          wx.showToast({
            title: '已删除',
            icon: 'success',
          })
        }
      },
    })
  },

  // 切换菜单显示
  toggleMenu() {
    this.setData({
      showMenu: !this.data.showMenu,
    })
  },

  // 隐藏菜单
  hideMenu() {
    this.setData({
      showMenu: false,
    })
  },

  // 跳转装备管理
  goToEquipment() {
    wx.navigateTo({
      url: '/pages/equipment/equipment',
    })
  },

  // 跳转数据统计
  goToStats() {
    wx.navigateTo({
      url: '/pages/stats/stats',
    })
  },

  // 切换表单显示
  toggleForm() {
    this.setData({
      showForm: !this.data.showForm,
    })
  },

  // 格式化日期
  formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}/${date.getDate()}`
  },

  // 获取类型标签
  getTypeLabel(type: string): string {
    const item = CLIMBING_TYPES.find(t => t.value === type)
    return item ? item.label : type
  },

  // 获取风格标签
  getStyleLabel(style: string): string {
    const item = ROUTE_STYLES.find(s => s.value === style)
    return item ? item.label : style
  },

  // 获取墙面风格标签
  getWallStyleLabel(wallStyle: string): string {
    const item = WALL_STYLES.find(w => w.value === wallStyle)
    return item ? item.subLabel : wallStyle
  },
})
