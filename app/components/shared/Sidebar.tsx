'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings,
  X, 
  Plus
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/authenticated/dashboard' },
    { name: 'Organization', icon: Settings, path: '/authenticated/organization' },
    { name: 'Department', icon: FolderKanban, path: '/authenticated/department' },
    { name: 'Role', icon: Users, path: '/authenticated/role' },
    { name: 'Designation', icon: BarChart3, path: '/authenticated/designation' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-backdrop z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-surface border-r border-default transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-default">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-foreground">PMO</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent-50 text-accent'
                          : 'text-muted hover:bg-accent-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-3 border-t border-default">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent-50 cursor-pointer">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-2 truncate">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
