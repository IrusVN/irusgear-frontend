//constants/userConstants.js
export const ROLE_ID = Object.freeze({
  DEFAULT: 0,
  ADMIN: 1,
  MANAGER: 2,
  CUSTOMER: 3,
  NEW_CUSTOMER: 4,
  ACCOUNTANT: 5,
  COURIER: 6,
})

export const USER_ROLES = [
  { value: '0', label: 'role.default' },
  { value: '1', label: 'role.admin' },
  { value: '2', label: 'role.manager' },
  { value: '3', label: 'role.customer' },
  { value: '4', label: 'role.new_customer' },
  { value: '5', label: 'role.accountant' },
  { value: '6', label: 'role.courier' },
]

export const USER_STATUSES = [
  { value: '0', label: 'Inactive' },
  { value: '1', label: 'Active' },
]
export const ADMIN_ROLES = ['1'];
export const MANAGER_ROLES = ['2'];
export const CUSTOMER_ROLES = ['3', '4'];
export const COURIER_ROLES = [String(ROLE_ID.COURIER)];
