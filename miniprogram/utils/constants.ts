// 常量定义

// 攀岩类型
export const CLIMBING_TYPES = [
  { value: 'bouldering', label: '抱石', system: 'v' },
  { value: 'toprope', label: '顶绳攀登', system: 'yds' },
  { value: 'lead', label: '先锋攀登', system: 'yds' },
  { value: 'autorope', label: '自动绳降', system: 'yds' },
]

// 难度等级 - V-scale (抱石)
export const V_GRADES = [
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
  'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'
]

// 难度等级 - YDS
export const YDS_GRADES = [
  '5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d',
  '5.15a', '5.15b', '5.15c', '5.15d'
]

// 难度等级 - 法式
export const FRENCH_GRADES = [
  '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+',
  '8a', '8a+', '8b', '8b+', '8c', '8c+',
  '9a', '9a+', '9b', '9b+', '9c'
]

// 岩点类型
export const HOLD_TYPES = [
  { value: 'mantle', label: 'Mantle', subLabel: '掌压' },
  { value: 'jug', label: 'Jug', subLabel: '大把手点' },
  { value: 'crimp', label: 'Crimp', subLabel: '抠点' },
  { value: 'sloper', label: 'Sloper', subLabel: '斜面点' },
  { value: 'pinch', label: 'Pinch', subLabel: '捏点' },
  { value: 'pocket', label: 'Pocket', subLabel: '洞点' },
  { value: 'gaston', label: 'Gaston', subLabel: '反抓手' },
  { value: 'undercling', label: 'Undercling', subLabel: '反抠' },
]

// 线路风格
export const ROUTE_STYLES = [
  { value: 'dynamic', label: '动态' },
  { value: 'static', label: '静态' },
  { value: 'balance', label: '平衡线' },
]

// 墙面风格
export const WALL_STYLES = [
  { value: 'face', label: 'Face Climbing', subLabel: '面攀' },
  { value: 'crack', label: 'Crack Climbing', subLabel: '裂缝攀登' },
  { value: 'slab', label: 'Slab', subLabel: '平板' },
  { value: 'vertical', label: 'Vertical', subLabel: '垂直壁' },
  { value: 'overhang', label: 'Overhang / Roof', subLabel: '悬岩/屋檐' },
  { value: 'arete', label: 'Arete', subLabel: '刃脊' },
  { value: 'dihedral', label: 'Dihedral', subLabel: '内角' },
  { value: 'chimney', label: 'Chimney', subLabel: '烟囱' },
]

// 装备类别
export const EQUIPMENT_CATEGORIES = [
  { value: 'shoes', label: '攀岩鞋' },
  { value: 'chalk', label: '镁粉' },
  { value: 'rope', label: '绳索' },
  { value: 'quickdraw', label: '锁具' },
  { value: 'trad', label: '扁带' },
  { value: 'harness', label: '安全带' },
  { value: 'helmet', label: '头盔' },
  { value: 'other', label: '其他' },
]

// 存储键名
export const STORAGE_KEYS = {
  ROUTES: 'climbing_routes',
  EQUIPMENT: 'climbing_equipment',
  USER_SETTINGS: 'user_settings',
}
