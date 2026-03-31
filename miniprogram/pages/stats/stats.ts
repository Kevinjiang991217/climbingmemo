import { routeStorage } from '../../utils/storage'
import { getStatsByClimbingType, getTotalStats } from '../../utils/analysis'

Page({
  data: {
    typeStats: [],
    overallStats: {
      totalRoutes: 0,
      sendCount: 0,
      flashCount: 0,
      sendRate: 0,
      flashRate: 0,
      avgAttemptsBouldering: 0,
      avgAttemptsRope: 0
    },
    selectedType: 'bouldering',
    // 折叠状态
    collapsed: {
      data: false,
      difficulty: true,
      hold: true,
      style: true,
      wall: true
    }
  },

  onLoad: function() {
    this.loadStats()
  },

  onShow: function() {
    this.loadStats()
  },

  loadStats: function() {
    const routes = routeStorage.getAll()
    const typeStats = getStatsByClimbingType(routes)
    const overallStats = getTotalStats(routes)

    const selectedType = typeStats.length > 0 ? typeStats[0].type : 'bouldering'

    this.setData({
      typeStats: typeStats,
      overallStats: overallStats,
      selectedType: selectedType
    })
  },

  onTypeSelect: function(e) {
    const type = e.currentTarget.dataset.type
    // 切换类型时重置折叠状态
    this.setData({
      selectedType: type,
      collapsed: {
        data: false,
        difficulty: false,
        hold: false,
        style: false,
        wall: false
      }
    })
  },

  // 切换折叠状态
  toggleCollapse: function(e) {
    const key = e.currentTarget.dataset.key
    const collapsed = this.data.collapsed
    collapsed[key] = !collapsed[key]
    this.setData({ collapsed: collapsed })
  },

  goBack: function() {
    wx.navigateBack()
  }
})
