'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '../../context/ApiContext'
import { decodeToken } from '@/app/utils/api/shared'
import { useTheme } from '../ThemeProvider'
import { Sun, Moon } from 'lucide-react'

interface HeaderProps {
  toggleSidebar: () => void
}

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  company: {
    id: number
    name: string
    address: string
  } | null
  designation: {
    id: number
    name: string
    description: string
  } | null
  isVerified: boolean
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const api = useApi()
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        if (!token) {
          setLoading(false)
          return
        }

        let user: any = null
        let ok = false
        try {
          const resp = await api.getProfile(token)
          ok = resp.ok && resp.data.status
          if (ok) user = resp.data.data
        } catch {}

        if (!ok) {
          user = decodeToken(token)
        }

        if (user) {
          setProfile({
            id: user.id || 0,
            name: user.name || user.username || user.email || 'User',
            email: user.email || '',
            role: user.role || '',
            company: user.company || null,
            designation: user.designation || null,
            isVerified: user.isVerified || false,
          })
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [api])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDropdown && !target.closest('.profile-dropdown')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      // Clear all possible token storage locations
      localStorage.removeItem('token')
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('authToken')
      
      // Clear any other user-related data you might have stored
      localStorage.removeItem('user')
      localStorage.removeItem('userProfile')
      
      // Close dropdown
      setShowDropdown(false)
      
      // Redirect to login page
      router.push('/')
      
      // Optional: Show success message
      // You can add a toast notification here if you have one
    } catch (error) {
      console.error('Logout error:', error)
      // Even if there's an error, still redirect to login
      router.push('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-surface border-b border-default px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-muted hover:text-foreground p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Search..."
              className="w-64 pl-9 pr-3 py-1.5 text-sm border border-muted rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <svg 
              className="absolute left-3 top-2 w-4 h-4 text-muted-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-muted hover:bg-accent-50"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile dropdown */}
          <div className="relative profile-dropdown">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 hover:bg-accent-50 rounded-lg"
            >
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-medium">
                  {loading ? '...' : profile ? getInitials(profile.name) : 'U'}
                </span>
              </div>
              <svg className="w-4 h-4 text-muted hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showDropdown && profile && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg shadow-lg border border-default py-2 z-50">
                <div className="px-4 py-3 border-b border-default">
                  <p className="text-sm font-medium text-foreground">{profile.name}</p>
                  <p className="text-xs text-muted-2">{profile.email}</p>
                  {profile.designation && (
                    <p className="text-xs text-muted-2 mt-1">{profile.designation.name}</p>
                  )}
                  {profile.role && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-accent-50 text-accent">
                      {profile.role}
                    </span>
                  )}
                </div>
                
                {profile.company && (
                  <div className="px-4 py-2 border-b border-default">
                    <p className="text-xs text-muted-2">Company</p>
                    <p className="text-sm text-foreground">{profile.company.name}</p>
                  </div>
                )}

                <div className="py-1">
                  <button 
                    onClick={() => {
                      setShowDropdown(false)
                      router.push('/profile')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent-50 transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                   className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-delete transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
