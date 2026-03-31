// equipment.ts - 装备管理页面
import { EQUIPMENT_CATEGORIES } from '../../utils/constants'
import { equipmentStorage, Equipment } from '../../utils/storage'

Page({
  data: {
    // 装备类别
    categories: EQUIPMENT_CATEGORIES,
    selectedCategory: 'shoes',

    // 装备列表
    equipmentList: [] as Equipment[],

    // 添加装备表单
    showAddForm: false,
    newEquipmentName: '',
    newEquipmentNotes: '',
  },

  onLoad() {
    this.loadEquipment()
  },

  onShow() {
    this.loadEquipment()
  },

  // 加载装备数据
  loadEquipment() {
    const list = equipmentStorage.getAll()
    this.setData({
      equipmentList: list,
    })
  },

  // 按类别筛选
  onCategoryChange(e: WechatMiniprogram.TouchEvent) {
    const category = e.currentTarget.dataset.value
    this.setData({
      selectedCategory: category,
    })
  },

  // 切换添加表单显示
  toggleAddForm() {
    this.setData({
      showAddForm: !this.data.showAddForm,
      newEquipmentName: '',
      newEquipmentNotes: '',
    })
  },

  // 输入装备名称
  onNameInput(e: WechatMiniprogram.Input) {
    this.setData({
      newEquipmentName: e.detail.value,
    })
  },

  // 输入备注
  onNotesInput(e: WechatMiniprogram.Input) {
    this.setData({
      newEquipmentNotes: e.detail.value,
    })
  },

  // 保存装备
  onSaveEquipment() {
    if (!this.data.newEquipmentName.trim()) {
      wx.showToast({
        title: '请输入装备名称',
        icon: 'none',
      })
      return
    }

    equipmentStorage.save({
      name: this.data.newEquipmentName.trim(),
      category: this.data.selectedCategory,
      notes: this.data.newEquipmentNotes.trim(),
    })

    wx.showToast({
      title: '保存成功',
      icon: 'success',
    })

    this.setData({
      showAddForm: false,
      newEquipmentName: '',
      newEquipmentNotes: '',
    })

    this.loadEquipment()
  },

  // 删除装备
  onDeleteEquipment(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这件装备吗？',
      success: (res) => {
        if (res.confirm) {
          equipmentStorage.delete(id)
          this.loadEquipment()
          wx.showToast({
            title: '已删除',
            icon: 'success',
          })
        }
      },
    })
  },

  // 获取类别标签
  getCategoryLabel(category: string): string {
    const item = EQUIPMENT_CATEGORIES.find(c => c.value === category)
    return item ? item.label : category
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },
})
