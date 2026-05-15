import type { AdminCategory } from '~/types/admin'

const categoryNames = [
  ['Smartphones', 'Latest phones, foldables, and mobile accessories.', 'bi-phone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=160&q=80'],
  ['Laptops', 'Ultrabooks, gaming laptops, and creator workstations.', 'bi-laptop', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=160&q=80'],
  ['Audio', 'Headphones, earbuds, speakers, and microphones.', 'bi-headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80'],
  ['Gaming Gear', 'Keyboards, mice, controllers, and gaming accessories.', 'bi-controller', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=160&q=80'],
  ['Wearables', 'Smart watches, trackers, and wearable technology.', 'bi-smartwatch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=160&q=80'],
  ['Tablets', 'Tablets for work, study, entertainment, and design.', 'bi-tablet', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=160&q=80'],
  ['Cameras', 'Cameras, action cams, lenses, and creator accessories.', 'bi-camera', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=160&q=80'],
  ['Smart Home', 'Home hubs, lighting, sensors, and security devices.', 'bi-house-gear', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=160&q=80'],
  ['PC Components', 'CPUs, GPUs, cases, storage, and cooling.', 'bi-gpu-card', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=160&q=80'],
  ['Accessories', 'Chargers, cables, cases, mounts, and daily essentials.', 'bi-usb-symbol', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=160&q=80'],
  ['Networking', 'Routers, mesh systems, switches, and adapters.', 'bi-router', 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=160&q=80'],
  ['Monitors', 'Office, creator, and gaming displays.', 'bi-display', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=160&q=80'],
]

export const adminCategoriesMock: AdminCategory[] = categoryNames.map(([name, description, icon, image], index) => {
  const id = index + 1
  return {
    id,
    name,
    slug: name.toLowerCase().replaceAll(' ', '-'),
    description,
    image,
    icon,
    productCount: 188 + id * 37,
    totalEarning: 12500000 + id * 7340000,
    status: id % 6 === 0 ? 'inactive' : 'active',
    createdAt: `2026-0${(id % 5) + 1}-0${(id % 8) + 1}T09:00:00.000Z`,
    updatedAt: `2026-05-${String((id % 20) + 1).padStart(2, '0')}T10:30:00.000Z`,
  }
})
