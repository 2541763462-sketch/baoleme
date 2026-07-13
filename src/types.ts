export interface Promotion {
  id: string
  type: 'fullReduction' | 'delivery' | 'newUser'
  label: string
  desc: string
  threshold: number
  discount: number
}

export interface Food {
  id: string
  shopId: string
  categoryId: string
  name: string
  desc: string
  price: number
  originalPrice: number
  image: string
  sales: number
  tags: string[]
}

export interface FoodCategory {
  id: string
  name: string
  icon: string
  foods: Food[]
}

export interface Shop {
  id: string
  name: string
  avatar: string
  image: string
  cover: string
  banner: string
  color: string
  category: string
  rating: number
  monthlySales: number
  deliveryTime: string
  distance: string
  deliveryFee: number
  minOrder: number
  tags: string[]
  promotions: Promotion[]
  categories: FoodCategory[]
}

export interface CartItem {
  food: Food
  quantity: number
  shopId: string
  shopName: string
}

export interface Coupon {
  id: string
  type: 'fullReduction' | 'delivery' | 'newUser'
  value: number
  threshold: number
  name: string
  desc: string
  validity: string
  claimed: boolean
}

export type DeliveryStatus = 'preparing' | 'accepted' | 'delivering' | 'rerouting' | 'lost'

export interface Address {
  name: string
  phone: string
  city: string
  detail: string
  doorplate: string
}

export interface Order {
  id: string
  items: CartItem[]
  shopName: string
  address: Address
  status: '配送中' | '已完成' | '已取消'
  totalAmount: number
  deliveryFee: number
  discountAmount: number
  finalAmount: number
  savedAmount: number
  createdAt: number
}
