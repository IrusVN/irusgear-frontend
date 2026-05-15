import type { AdminProduct } from '~/types/admin'
import { adminCategoriesMock } from './categories.mock'

const productNames = [
  'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'MacBook Air M3', 'ASUS ROG Zephyrus G14',
  'Sony WH-1000XM5', 'AirPods Pro 2', 'Logitech MX Master 3S', 'Keychron K8 Pro',
  'Apple Watch Series 9', 'iPad Pro 12.9', 'Canon EOS R50', 'GoPro Hero 12',
  'Nintendo Switch OLED', 'PlayStation Portal', 'Dell UltraSharp U2723QE', 'LG UltraGear 27GP850',
  'Anker 737 Power Bank', 'Belkin MagSafe Charger', 'TP-Link Deco XE75', 'Synology DS224+',
]

const productImages = [
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=180&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=180&q=80',
]

export const adminProductsMock: AdminProduct[] = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1
  const category = adminCategoriesMock[index % adminCategoriesMock.length]
  const baseName = productNames[index % productNames.length]
  const name = index < productNames.length ? baseName : `${baseName} ${Math.floor(index / productNames.length) + 1}`
  const quantity = (id * 37) % 940
  const price = 790000 + ((id * 683000) % 42000000)
  const sales = 18 + ((id * 47) % 940)
  const statusCycle = ['publish', 'scheduled', 'publish', 'inactive', 'draft'] as const

  return {
    id,
    name,
    slug: name.toLowerCase().replaceAll(' ', '-'),
    vendor: ['IrusGear', 'Apple', 'Samsung', 'Sony', 'Logitech', 'ASUS'][id % 6],
    description: `${name} is part of the IrusGear ecommerce admin mock catalog.`,
    sku: `IRG-${String(53000 + id * 73).padStart(5, '0')}`,
    categoryId: category.id,
    categoryName: category.name,
    categoryIcon: category.icon,
    image: productImages[index % productImages.length],
    price,
    compareAtPrice: id % 3 === 0 ? price + 1200000 : undefined,
    quantity,
    sales,
    revenue: price * sales,
    status: statusCycle[index % statusCycle.length],
    stockState: quantity === 0 ? 'out_of_stock' : quantity < 50 ? 'low_stock' : 'in_stock',
    stockEnabled: id % 4 !== 0,
    featured: id % 7 === 0,
    rating: Number((4 + ((id % 9) / 10)).toFixed(1)),
    createdAt: `2026-03-${String((id % 26) + 1).padStart(2, '0')}T08:00:00.000Z`,
    updatedAt: `2026-05-${String((id % 22) + 1).padStart(2, '0')}T14:20:00.000Z`,
  }
})
