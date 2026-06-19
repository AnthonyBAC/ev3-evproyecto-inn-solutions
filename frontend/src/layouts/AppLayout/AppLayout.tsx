import { Button, Drawer, Layout, Menu, Typography } from 'antd'
import {
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu as MenuIcon,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { isAppPageKey } from '../../types/AppPageKey'
import type { AppLayoutProps } from './types/AppLayoutProps'
import './AppLayout.css'

const { Content } = Layout

const NAVIGATION_ITEMS = [
  {
    key: 'dashboard',
    icon: <LayoutDashboard size={18} />,
    label: 'Principal',
  },
  {
    key: 'projects',
    icon: <FolderKanban size={18} />,
    label: 'Proyectos',
  },
  {
    key: 'tasks',
    icon: <ListTodo size={18} />,
    label: 'Tareas',
  },
]

export function AppLayout({
  children,
  onLogout,
  onSelectPage,
  pageDescription,
  pageTitle,
  selectedPage,
}: AppLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true)

  const openDrawer = (): void => setIsDrawerOpen(true)
  const closeDrawer = (): void => setIsDrawerOpen(false)

  const handleSelectPage = (key: string): void => {
    if (isAppPageKey(key)) {
      onSelectPage(key)
      closeDrawer()
    }
  }

  return (
    <Layout className="app-layout">
      <Content className="app-layout__content">
        <header className="app-layout__header">
          <div className="app-layout__header-top">
            <Button
              className="app-layout__menu-toggle"
              icon={<MenuIcon size={18} />}
              type="default"
              onClick={openDrawer}
            />

            <div className="app-layout__brand">
              <div className="app-layout__brand-icon">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <p className="app-layout__eyebrow">EV Proyecto EV3</p>
                <h1 className="app-layout__brand-title">Innovatech MVP</h1>
              </div>
            </div>
          </div>

          <Typography.Text className="app-layout__section-label">
            Aplicacion local
          </Typography.Text>
          <Typography.Title className="app-layout__title" level={2}>
            {pageTitle}
          </Typography.Title>
          <Typography.Paragraph className="app-layout__description">
            {pageDescription}
          </Typography.Paragraph>
        </header>

        <main className="app-layout__page">{children}</main>
      </Content>

      <Drawer
        className="app-layout__drawer"
        closable={false}
        open={isDrawerOpen}
        placement="left"
        width={280}
        styles={{
          body: { padding: 0 },
        }}
        title={
          <div className="app-layout__drawer-header">
            <div className="app-layout__brand">
              <div className="app-layout__brand-icon">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <p className="app-layout__eyebrow">EV Proyecto EV3</p>
                <h1 className="app-layout__brand-title">Innovatech MVP</h1>
              </div>
            </div>
            <Button
              className="app-layout__drawer-close"
              icon={<X size={18} />}
              type="text"
              onClick={closeDrawer}
            />
          </div>
        }
        onClose={closeDrawer}
      >
        <div className="app-layout__drawer-body">
          <Menu
            className="app-layout__menu"
            items={NAVIGATION_ITEMS}
            mode="inline"
            selectedKeys={[selectedPage]}
            onClick={({ key }) => handleSelectPage(key)}
          />

          <button
            className="app-layout__logout-btn"
            type="button"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Cerrar sesion</span>
          </button>
        </div>
      </Drawer>
    </Layout>
  )
}
