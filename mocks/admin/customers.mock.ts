import type { AdminCustomer } from '~/types/admin'

const names = [
  'Manon Fossick', 'Erny Picard', 'Brooke Tegler', 'Inger Weadick', 'Raffaello Reaney',
  'Paulie Floch', 'Darby Leming', 'Goddard Fosher', 'Lauritz Ramble', 'Cherice Fairclough',
  'Chere Schofield', 'Boycie Hartmann', 'Ulysses Goodlife', 'Carmon Vasiljevic', 'Hilliard Merck',
  'Chad Cock', 'Lyndsey Dorey', 'Octavius Whitchurch', 'Sibley Braithwaite', 'Damara Figgins',
]

const countries = [
  ['Vietnam', 'VN'], ['United States', 'US'], ['Australia', 'AU'], ['France', 'FR'], ['Singapore', 'SG'], ['Japan', 'JP'], ['China', 'CN'],
]

const initialsFor = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

export const adminCustomersMock: AdminCustomer[] = Array.from({ length: 100 }, (_, index) => {
  const id = 478426 + index * 913
  const name = names[index % names.length]
  const [country, countryCode] = countries[index % countries.length]
  const city = ['Ho Chi Minh City', 'New York', 'Sydney', 'Paris', 'Singapore', 'Tokyo', 'Shanghai'][index % 7]
  const statusCycle = ['active', 'active', 'active', 'inactive', 'blocked'] as const
  const loyaltyCycle = ['standard', 'gold', 'platinum'] as const

  return {
    id,
    customerCode: `#${id}`,
    name,
    email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
    phone: `+${84 + (index % 20)} ${String(900000000 + index * 13729).slice(0, 9)}`,
    avatar: `https://i.pravatar.cc/96?img=${(index % 68) + 1}`,
    initials: initialsFor(name),
    country,
    countryCode,
    orders: 12 + ((index * 37) % 880),
    totalSpent: 1200000 + ((index * 847000) % 230000000),
    accountBalance: 250000 + ((index * 131000) % 18000000),
    loyaltyTier: loyaltyCycle[index % loyaltyCycle.length],
    loyaltyPoints: 300 + ((index * 97) % 9000),
    wishlistCount: (index * 5) % 46,
    couponCount: (index * 3) % 24,
    status: statusCycle[index % statusCycle.length],
    billingAddress: {
      line1: `${45 + index} Nguyen Hue Street`,
      city,
      country,
      postalCode: `${70000 + index}`,
    },
    shippingAddress: {
      line1: `${101 + index} Le Loi Avenue`,
      city,
      country,
      postalCode: `${71000 + index}`,
    },
    createdAt: `2026-02-${String((index % 25) + 1).padStart(2, '0')}T07:15:00.000Z`,
    updatedAt: `2026-05-${String((index % 25) + 1).padStart(2, '0')}T11:40:00.000Z`,
  }
})
