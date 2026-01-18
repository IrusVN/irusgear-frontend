export function hasPermission(permissionName, permissions) {

  if (!permissionName || !permissions) return false;

  if (typeof permissions === 'object' && !Array.isArray(permissions)) {
    permissions = permissions.permissions || permissions;
  }

  if (typeof permissions === 'string') {
    permissions = permissions.split(',').map(p => p.trim());
  }

  return Array.isArray(permissions) && permissions.includes(permissionName);
}
