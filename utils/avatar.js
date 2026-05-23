export const getUserDisplayName = (user, fallback = '') => {
  if (!user) return fallback

  const explicitName = user.full_name || user.name
  if (explicitName) return explicitName

  const combinedName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  return combinedName || fallback
}

export const buildInitialsAvatarUrl = (
  name,
  {
    background = '1a1a1a',
    color = 'fff',
    size,
  } = {},
) => {
  const params = [
    `name=${encodeURIComponent(name || 'User')}`,
    `background=${encodeURIComponent(background)}`,
    `color=${encodeURIComponent(color)}`,
  ]

  if (size) {
    params.push(`size=${encodeURIComponent(String(size))}`)
  }

  return `https://ui-avatars.com/api/?${params.join('&')}`
}

const appendVersionParam = (url, version) => {
  if (!url || !version) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${encodeURIComponent(String(version))}`
}

export const getUserAvatarFallbackUrl = (
  user,
  {
    name,
    background = '1a1a1a',
    color = 'fff',
    size,
  } = {},
) => buildInitialsAvatarUrl(name || getUserDisplayName(user), {
  background,
  color,
  size,
})

export const resolveUserAvatarUrl = (
  user,
  {
    name,
    fallback = '',
    background = '1a1a1a',
    color = 'fff',
    size,
  } = {},
) => {
  if (!user) return fallback

  const avatarUrl = user.avatarUrl || user.avatar_url
  if (avatarUrl) {
    return appendVersionParam(avatarUrl, user.avatarUpdatedAt || user.avatar_updated_at)
  }

  return getUserAvatarFallbackUrl(user, {
    name,
    background,
    color,
    size,
  })
}
