// 数据分析工具

import { HOLD_TYPES, V_GRADES, YDS_GRADES, FRENCH_GRADES } from './constants'

// 获取难度数值（用于排序和趋势计算）
export function getDifficultyValue(difficulty, system) {
  if (system === 'v') {
    return V_GRADES.indexOf(difficulty)
  } else if (system === 'yds') {
    return YDS_GRADES.indexOf(difficulty)
  } else if (system === 'french') {
    return FRENCH_GRADES.indexOf(difficulty)
  }
  return 0
}

// 获取难度趋势数据（按月统计平均难度）
export function getDifficultyTrend(routes) {
  if (!routes || routes.length === 0) return []

  const monthlyData = {}

  routes.forEach(function(route) {
    const date = new Date(route.date)
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, count: 0 }
    }

    const difficultyValue = getDifficultyValue(route.difficulty, route.difficultySystem)
    monthlyData[monthKey].total += difficultyValue
    monthlyData[monthKey].count += 1
  })

  return Object.entries(monthlyData)
    .sort(function(a, b) { return a[0].localeCompare(b[0]) })
    .map(function(_ref) {
      const month = _ref[0]
      const data = _ref[1]
      return {
        month: month,
        avgDifficulty: data.count > 0 ? data.total / data.count : 0,
        count: data.count,
      }
    })
}

// 岩点类型统计
export function getHoldStats(routes) {
  const holdStats = {}

  // 初始化所有岩点类型
  HOLD_TYPES.forEach(function(h) {
    holdStats[h.value] = { count: 0, successCount: 0 }
  })

  routes.forEach(function(route) {
    route.holds.forEach(function(hold) {
      if (holdStats[hold]) {
        holdStats[hold].count += 1
        if (route.flash) {
          holdStats[hold].successCount += 1
        }
      }
    })
  })

  return HOLD_TYPES.map(function(h) {
    const stats = holdStats[h.value]
    return {
      hold: h.value,
      label: h.label,
      subLabel: h.subLabel,
      count: stats.count,
      successCount: stats.successCount,
      successRate: stats.count > 0 ? stats.successCount / stats.count : 0,
    }
  })
}

// 分析擅长和薄弱的岩点类型
export function analyzeStrengthsAndWeaknesses(routes) {
  const holdStats = getHoldStats(routes)

  // 过滤出使用次数>=2的岩点
  const usedHolds = holdStats.filter(function(h) { return h.count >= 2 })

  if (usedHolds.length === 0) {
    return { strengths: [], weaknesses: [] }
  }

  // 按成功率排序
  const sorted = usedHolds.slice().sort(function(a, b) { return b.successRate - a.successRate })

  // 擅长：成功率最高的前3个
  const strengths = sorted.slice(0, 3).map(function(h) {
    return {
      hold: h.hold,
      label: h.label,
      subLabel: h.subLabel,
      successRate: h.successRate,
      count: h.count,
    }
  })

  // 薄弱：成功率最低的前3个
  const weaknesses = sorted.slice(-3).reverse().map(function(h) {
    return {
      hold: h.hold,
      label: h.label,
      subLabel: h.subLabel,
      successRate: h.successRate,
      count: h.count,
    }
  })

  return { strengths: strengths, weaknesses: weaknesses }
}

// 统计攀爬类型分布
export function getTypeDistribution(routes) {
  const typeStats = {}

  routes.forEach(function(route) {
    typeStats[route.type] = (typeStats[route.type] || 0) + 1
  })

  return Object.entries(typeStats).map(function(_ref2) {
    const type = _ref2[0]
    const count = _ref2[1]
    return { type: type, count: count }
  })
}

// 统计线路风格分布
export function getStyleDistribution(routes) {
  const styleStats = {}

  routes.forEach(function(route) {
    styleStats[route.style] = (styleStats[route.style] || 0) + 1
  })

  return Object.entries(styleStats).map(function(_ref3) {
    const style = _ref3[0]
    const count = _ref3[1]
    return { style: style, count: count }
  })
}

// 统计墙面风格分布
export function getWallStyleDistribution(routes) {
  const wallStyleStats = {}

  routes.forEach(function(route) {
    if (route.wallStyle) {
      wallStyleStats[route.wallStyle] = (wallStyleStats[route.wallStyle] || 0) + 1
    }
  })

  return Object.entries(wallStyleStats).map(function(_ref4) {
    const wallStyle = _ref4[0]
    const count = _ref4[1]
    return { wallStyle: wallStyle, count: count }
  })
}

// 获取总统计
export function getTotalStats(routes) {
  const totalRoutes = routes ? routes.length : 0
  const sendCount = routes ? routes.filter(function(r) { return r.send }).length : 0
  const sendRate = totalRoutes > 0 ? sendCount / totalRoutes : 0

  // Flash统计
  const flashCount = routes ? routes.filter(function(r) { return r.flash }).length : 0
  const flashRate = totalRoutes > 0 ? flashCount / totalRoutes : 0

  // 抱石平均尝试次数
  const boulderingRoutes = routes ? routes.filter(function(r) { return r.send && r.type === 'bouldering' }) : []
  const avgAttemptsBouldering = boulderingRoutes.length > 0
    ? boulderingRoutes.reduce(function(sum, r) { return sum + r.attempts }, 0) / boulderingRoutes.length
    : 0

  // 绳攀平均尝试次数（顶绳、先锋、自动绳降）
  const ropeRoutes = routes ? routes.filter(function(r) { return r.send && ['toprope', 'lead', 'autorope'].includes(r.type) }) : []
  const avgAttemptsRope = ropeRoutes.length > 0
    ? ropeRoutes.reduce(function(sum, r) { return sum + r.attempts }, 0) / ropeRoutes.length
    : 0

  return {
    totalRoutes: totalRoutes,
    sendCount: sendCount,
    sendRate: Math.round(sendRate * 100),
    flashCount: flashCount,
    flashRate: Math.round(flashRate * 100),
    avgAttemptsBouldering: Math.round(avgAttemptsBouldering * 10) / 10,
    avgAttemptsRope: Math.round(avgAttemptsRope * 10) / 10,
  }
}

// 按难度等级统计Flash率
export function getFlashRateByDifficulty(routes) {
  const difficultyStats = {}

  routes.forEach(function(route) {
    const key = route.difficultySystem + ':' + route.difficulty
    if (!difficultyStats[key]) {
      difficultyStats[key] = { flash: 0, total: 0 }
    }
    difficultyStats[key].total += 1
    if (route.flash) {
      difficultyStats[key].flash += 1
    }
  })

  return Object.entries(difficultyStats)
    .map(function(_ref5) {
      const key = _ref5[0]
      const stats = _ref5[1]
      return {
        difficulty: key,
        flashCount: stats.flash,
        totalCount: stats.total,
        flashRate: stats.total > 0 ? Math.round(stats.flash / stats.total * 100) : 0,
      }
    })
    .sort(function(a, b) { return b.flashRate - a.flashRate })
}

// 获取平均Attempts按难度等级
export function getAvgAttemptsByDifficulty(routes) {
  const sentRoutes = routes ? routes.filter(function(r) { return r.send }) : []
  const difficultyStats = {}

  sentRoutes.forEach(function(route) {
    const key = route.difficultySystem + ':' + route.difficulty
    if (!difficultyStats[key]) {
      difficultyStats[key] = { total: 0, count: 0 }
    }
    difficultyStats[key].total += route.attempts
    difficultyStats[key].count += 1
  })

  return Object.entries(difficultyStats)
    .map(function(_ref6) {
      const key = _ref6[0]
      const stats = _ref6[1]
      return {
        difficulty: key,
        avgAttempts: Math.round(stats.total / stats.count * 10) / 10,
        count: stats.count,
      }
    })
    .sort(function(a, b) { return a.avgAttempts - b.avgAttempts })
}

// 按攀岩类型统计分析
export function getStatsByClimbingType(routes) {
  const CLIMBING_TYPE_VALUES = ['bouldering', 'toprope', 'lead', 'autorope']
  const CLIMBING_TYPE_LABELS = {
    bouldering: '抱石',
    toprope: '顶绳',
    lead: '先锋',
    autorope: '自动绳降'
  }

  const HOLD_LABELS = {
    mantle: { label: 'Mantle', subLabel: '掌压' },
    jug: { label: 'Jug', subLabel: '大把手点' },
    crimp: { label: 'Crimp', subLabel: '抠点' },
    sloper: { label: 'Sloper', subLabel: '斜面点' },
    pinch: { label: 'Pinch', subLabel: '捏点' },
    pocket: { label: 'Pocket', subLabel: '洞点' },
    gaston: { label: 'Gaston', subLabel: '反抓手' },
    undercling: { label: 'Undercling', subLabel: '反抠' },
  }

  const STYLE_LABELS = {
    dynamic: '动态',
    static: '静态',
    balance: '平衡线'
  }

  const WALL_LABELS = {
    face: { label: 'Face', subLabel: '面攀' },
    crack: { label: 'Crack', subLabel: '裂缝' },
    slab: { label: 'Slab', subLabel: '平板' },
    vertical: { label: 'Vertical', subLabel: '垂直' },
    overhang: { label: 'Overhang', subLabel: '悬岩' },
    arete: { label: 'Arete', subLabel: '刃脊' },
    dihedral: { label: 'Dihedral', subLabel: '内角' },
    chimney: { label: 'Chimney', subLabel: '烟囱' },
  }

  if (!routes) routes = []

  return CLIMBING_TYPE_VALUES.map(function(type) {
    const typeRoutes = routes.filter(function(r) { return r.type === type })
    const sentRoutes = typeRoutes.filter(function(r) { return r.send })

    // 统计数量
    const totalCount = typeRoutes.length
    const sendCount = sentRoutes.length
    const flashCount = typeRoutes.filter(function(r) { return r.flash }).length

    // 计算成功率
    const sendRate = totalCount > 0 ? Math.round(sendCount / totalCount * 100) : 0
    const flashRate = totalCount > 0 ? Math.round(flashCount / totalCount * 100) : 0

    // 平均尝试次数
    const avgAttempts = sentRoutes.length > 0
      ? Math.round(sentRoutes.reduce(function(sum, r) { return sum + r.attempts }, 0) / sentRoutes.length * 10) / 10
      : 0

    // 热门难度 TOP3
    const difficultyStats = {}
    typeRoutes.forEach(function(r) {
      difficultyStats[r.difficulty] = (difficultyStats[r.difficulty] || 0) + 1
    })
    const topDifficulties = Object.entries(difficultyStats)
      .map(function(_ref7) {
        const difficulty = _ref7[0]
        const count = _ref7[1]
        return { difficulty: difficulty, count: count }
      })
      .sort(function(a, b) { return b.count - a.count })
      .slice(0, 3)

    // 岩点使用统计
    const holdCountMap = {}
    typeRoutes.forEach(function(r) {
      r.holds.forEach(function(h) {
        holdCountMap[h] = (holdCountMap[h] || 0) + 1
      })
    })
    const holdStats = Object.entries(holdCountMap)
      .map(function(_ref8) {
        const hold = _ref8[0]
        const count = _ref8[1]
        return {
          hold: hold,
          label: HOLD_LABELS[hold] ? HOLD_LABELS[hold].label : hold,
          subLabel: HOLD_LABELS[hold] ? HOLD_LABELS[hold].subLabel : hold,
          count: count
        }
      })
      .sort(function(a, b) { return b.count - a.count })

    // 风格统计
    const styleCountMap = {}
    typeRoutes.forEach(function(r) {
      if (r.style) {
        styleCountMap[r.style] = (styleCountMap[r.style] || 0) + 1
      }
    })
    const styleStats = Object.entries(styleCountMap)
      .map(function(_ref9) {
        const style = _ref9[0]
        const count = _ref9[1]
        return {
          style: style,
          label: STYLE_LABELS[style] || style,
          count: count
        }
      })
      .sort(function(a, b) { return b.count - a.count })

    // 墙面风格统计
    const wallCountMap = {}
    typeRoutes.forEach(function(r) {
      if (r.wallStyle) {
        wallCountMap[r.wallStyle] = (wallCountMap[r.wallStyle] || 0) + 1
      }
    })
    const wallStats = Object.entries(wallCountMap)
      .map(function(_ref10) {
        const wallStyle = _ref10[0]
        const count = _ref10[1]
        return {
          wallStyle: wallStyle,
          label: WALL_LABELS[wallStyle] ? WALL_LABELS[wallStyle].label : wallStyle,
          subLabel: WALL_LABELS[wallStyle] ? WALL_LABELS[wallStyle].subLabel : wallStyle,
          count: count
        }
      })
      .sort(function(a, b) { return b.count - a.count })

    return {
      type: type,
      label: CLIMBING_TYPE_LABELS[type],
      totalCount: totalCount,
      sendCount: sendCount,
      flashCount: flashCount,
      sendRate: sendRate,
      flashRate: flashRate,
      avgAttempts: avgAttempts,
      topDifficulties: topDifficulties,
      holdStats: holdStats,
      styleStats: styleStats,
      wallStats: wallStats
    }
  })
}
