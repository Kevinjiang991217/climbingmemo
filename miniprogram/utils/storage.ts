// 本地存储工具

import { STORAGE_KEYS } from './constants'

// 线路记录
export interface Route {
  id: string
  type: string
  difficulty: string
  difficultySystem: string
  holds: string[]
  style: string
  wallStyle: string
  gym: string
  date: number
  flash: boolean       // 是否Flash（一次成功）
  send: boolean       // 是否最终send（用户标记完成）
  attempts: number    // 尝试次数（flash=1，send=attempts）
  notes?: string
}

// 装备
export interface Equipment {
  id: string
  name: string
  category: string
  purchaseDate?: number
  notes?: string
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 线路存储
export const routeStorage = {
  getAll(): Route[] {
    const data = wx.getStorageSync(STORAGE_KEYS.ROUTES)
    return data ? JSON.parse(data) : []
  },

  save(route: Omit<Route, 'id' | 'date'>): Route {
    const routes = this.getAll()
    const newRoute: Route = {
      ...route,
      id: generateId(),
      date: Date.now(),
    }
    routes.unshift(newRoute)
    wx.setStorageSync(STORAGE_KEYS.ROUTES, JSON.stringify(routes))
    return newRoute
  },

  delete(id: string): boolean {
    const routes = this.getAll()
    const index = routes.findIndex(r => r.id === id)
    if (index > -1) {
      routes.splice(index, 1)
      wx.setStorageSync(STORAGE_KEYS.ROUTES, JSON.stringify(routes))
      return true
    }
    return false
  },

  update(id: string, data: Partial<Route>): boolean {
    const routes = this.getAll()
    const index = routes.findIndex(r => r.id === id)
    if (index > -1) {
      routes[index] = { ...routes[index], ...data }
      wx.setStorageSync(STORAGE_KEYS.ROUTES, JSON.stringify(routes))
      return true
    }
    return false
  },

  clear() {
    wx.removeStorageSync(STORAGE_KEYS.ROUTES)
  }
}

// 装备存储
export const equipmentStorage = {
  getAll(): Equipment[] {
    const data = wx.getStorageSync(STORAGE_KEYS.EQUIPMENT)
    return data ? JSON.parse(data) : []
  },

  save(equipment: Omit<Equipment, 'id'>): Equipment {
    const list = this.getAll()
    const newEquipment: Equipment = {
      ...equipment,
      id: generateId(),
    }
    list.push(newEquipment)
    wx.setStorageSync(STORAGE_KEYS.EQUIPMENT, JSON.stringify(list))
    return newEquipment
  },

  delete(id: string): boolean {
    const list = this.getAll()
    const index = list.findIndex(e => e.id === id)
    if (index > -1) {
      list.splice(index, 1)
      wx.setStorageSync(STORAGE_KEYS.EQUIPMENT, JSON.stringify(list))
      return true
    }
    return false
  },

  update(id: string, data: Partial<Equipment>): boolean {
    const list = this.getAll()
    const index = list.findIndex(e => e.id === id)
    if (index > -1) {
      list[index] = { ...list[index], ...data }
      wx.setStorageSync(STORAGE_KEYS.EQUIPMENT, JSON.stringify(list))
      return true
    }
    return false
  },

  clear() {
    wx.removeStorageSync(STORAGE_KEYS.EQUIPMENT)
  }
}
