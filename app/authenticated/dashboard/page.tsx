'use client'

import React from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  ShoppingCart, 
  Activity,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react'

const Dashboard = () => {
  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '-3.2%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Active Sessions',
      value: '573',
      change: '+8.7%',
      trend: 'up',
      icon: Activity,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  const recentActivity = [
    { name: 'Sarah Johnson', action: 'created a new project', time: '2 minutes ago', avatar: 'SJ' },
    { name: 'Mike Chen', action: 'completed task #234', time: '15 minutes ago', avatar: 'MC' },
    { name: 'Emma Wilson', action: 'updated dashboard settings', time: '1 hour ago', avatar: 'EW' },
    { name: 'David Brown', action: 'added 3 new team members', time: '2 hours ago', avatar: 'DB' },
    { name: 'Lisa Anderson', action: 'generated monthly report', time: '3 hours ago', avatar: 'LA' },
  ]

  const topProjects = [
    { name: 'Website Redesign', progress: 75, status: 'On Track', color: 'bg-blue-600' },
    { name: 'Mobile App Development', progress: 45, status: 'In Progress', color: 'bg-green-600' },
    { name: 'Marketing Campaign', progress: 90, status: 'Near Completion', color: 'bg-purple-600' },
    { name: 'Database Migration', progress: 30, status: 'At Risk', color: 'bg-orange-600' },
  ]

  return (
    <div className="space-y-6 px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, John! Here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-950 text-white text-sm font-medium rounded-lg transition-colors">
          <span>Download Report</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp size={14} className="text-green-600" />
                    ) : (
                      <TrendingDown size={14} className="text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">Monthly revenue for the last 6 months</p>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <MoreVertical size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 80, 55, 75, 90].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-medium">{activity.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.name}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Add New User</p>
              <p className="text-xs text-gray-500 mt-0.5">Invite team members</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <ShoppingCart size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Create Order</p>
              <p className="text-xs text-gray-500 mt-0.5">Process new orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <Activity size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
              <p className="text-xs text-gray-500 mt-0.5">Detailed insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
