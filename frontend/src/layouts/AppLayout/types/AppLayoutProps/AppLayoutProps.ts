import type { ReactNode } from 'react'
import type { AppPageKey } from '../../../../types/AppPageKey'

export interface AppLayoutProps {
  children: ReactNode
  onLogout: () => void
  onSelectPage: (page: AppPageKey) => void
  pageDescription: string
  pageTitle: string
  selectedPage: AppPageKey
}
