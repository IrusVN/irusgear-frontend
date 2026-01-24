import { USER_ROLES } from '@/constants/userConstants'

export const getUserRoleKey = (roleId) => {
  return USER_ROLES.find(r => r.value === String(roleId))?.label || 'common.unknown'
}
