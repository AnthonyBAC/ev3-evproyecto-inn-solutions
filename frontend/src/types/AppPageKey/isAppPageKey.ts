import type { AppPageKey } from './AppPageKey'

export function isAppPageKey(value: unknown): value is AppPageKey {
  return value === 'dashboard' || value === 'projects' || value === 'tasks'
}
