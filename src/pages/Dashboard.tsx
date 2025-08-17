import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import MetricsOverview from '@/components/dashboard/MetricsOverview'
import RealtimeMetrics from '@/components/dashboard/RealtimeMetrics'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import QuickActions from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  const { data: dashboardMetrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => api.getDashboardMetrics(),
    retry: false, // Don't retry failed requests
  })

  const { data: realtimeMetrics, isLoading: realtimeLoading, error: realtimeError } = useQuery({
    queryKey: ['realtime-metrics'],
    queryFn: () => api.getRealTimeMetrics(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: false, // Don't retry failed requests
  })

  // Mock data fallbacks for demo purposes
  const mockDashboardMetrics = {
    success: true,
    data: {
      overview: {
        total_customers: 1234,
        total_interactions: 5678,
        total_ai_queries: 892,
        avg_response_time: 2.3,
        customer_satisfaction: 4.2,
        resolution_rate: 0.87
      },
      trends: {
        customer_growth: [],
        interaction_volume: [],
        ai_usage: [],
        satisfaction_trend: []
      },
      performance: {
        top_agents: [],
        ai_metrics: {
          total_queries: 892,
          avg_confidence: 0.87,
          cache_hit_rate: 0.65,
          error_rate: 0.02
        }
      },
      insights: {
        peak_hours: [],
        popular_channels: [],
        sentiment_distribution: {
          positive: 0.7,
          neutral: 0.2,
          negative: 0.1
        },
        escalation_rate: 0.15
      }
    }
  }

  const mockRealtimeMetrics = {
    success: true,
    data: [
      {
        id: '1',
        name: 'Active Users',
        value: 142,
        change_percentage: 12,
        trend: 'up' as const,
        last_updated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Response Time',
        value: 2.1,
        change_percentage: -8.5,
        trend: 'down' as const,
        last_updated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Queue Length',
        value: 5,
        change_percentage: -37.5,
        trend: 'down' as const,
        last_updated: new Date().toISOString()
      }
    ]
  }

  if (metricsLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  // Use mock data if API fails
  const effectiveDashboardMetrics = dashboardMetrics || (metricsError ? mockDashboardMetrics : null)
  const effectiveRealtimeMetrics = realtimeMetrics || (realtimeError ? mockRealtimeMetrics : null)

  return (
    <div className="space-y-6">
      {/* Demo Mode Notice */}
      {(metricsError || realtimeError) ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <p className="mt-1 text-sm text-blue-700">
                Displaying sample data. Connect your API backend for real metrics.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your CRM.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <QuickActions />
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview 
        data={effectiveDashboardMetrics?.data} 
        loading={metricsLoading}
      />

      {/* Real-time Metrics */}
      <RealtimeMetrics 
        data={effectiveRealtimeMetrics?.data} 
        loading={realtimeLoading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Customer satisfaction increased by 12% this week
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Based on sentiment analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Response time spike detected in email channel
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Requires attention
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    AI suggestions acceptance rate at 87%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Above target
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Agents */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Top Agents
            </h3>
            <div className="space-y-4">
              {dashboardMetrics?.data?.performance?.top_agents?.slice(0, 3).map((agent) => (
                <div key={agent.agent_id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {agent.agent_name?.charAt(0) || '#'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {agent.agent_name || `Agent ${agent.agent_id}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {agent.satisfaction_score}% satisfaction
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {agent.total_interactions}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      interactions
                    </p>
                  </div>
                </div>
              )) || []}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}