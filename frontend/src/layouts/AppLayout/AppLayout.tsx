import { Layout, Menu, Tooltip, Typography } from 'antd'
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { isAppPageKey } from '../../types/AppPageKey'
import type { AppLayoutProps } from './types/AppLayoutProps'
import './AppLayout.css'

const { Content, Sider } = Layout

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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <Layout className="app-layout">
      <Sider
        className="app-layout__sider"
        collapsed={isCollapsed}
        collapsedWidth={80}
        width={248}
        trigger={null}
      >
        <div className="app-layout__sider-inner">
          <div className="app-layout__sider-rail">
            <div className="app-layout__sider-top">
              <div className="app-layout__brand">
                <div className="app-layout__brand-icon">
                  <BriefcaseBusiness size={20} />
                </div>
                {!isCollapsed ? (
                  <div className="app-layout__brand-text">
                    <p className="app-layout__eyebrow">EV Proyecto EV3</p>
                    <h1 className="app-layout__brand-title">Innovatech MVP</h1>
                  </div>
                ) : null}
              </div>

              <Menu
                className="app-layout__menu"
                inlineCollapsed={isCollapsed}
                items={NAVIGATION_ITEMS}
                mode="inline"
                selectedKeys={[selectedPage]}
                onClick={({ key }) => {
                  if (isAppPageKey(key)) {
                    onSelectPage(key)
                  }
                }}
              />
            </div>

            <div className="app-layout__sider-footer">
              {isCollapsed ? (
                <Tooltip placement="right" title="Expandir">
                  <button
                    aria-label="Expandir"
                    className="app-layout__collapse-btn app-layout__collapse-btn--compact"
                    type="button"
                    onClick={() => setIsCollapsed(false)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </Tooltip>
              ) : null}

              <div className="app-layout__logout-row">
                <button
                  aria-label="Cerrar sesion"
                  className="app-layout__logout-btn"
                  type="button"
                  onClick={onLogout}
                >
                  <LogOut size={18} />
                  {!isCollapsed ? <span>Cerrar sesion</span> : null}
                </button>

                {!isCollapsed ? (
                  <Tooltip placement="top" title="Colapsar">
                    <button
                      aria-label="Colapsar"
                      className="app-layout__collapse-btn"
                      type="button"
                      onClick={() => setIsCollapsed(true)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </Tooltip>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Sider>

      <Layout>
        <Content className="app-layout__content">
          <header className="app-layout__header">
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
      </Layout>
    </Layout>
  )
}
