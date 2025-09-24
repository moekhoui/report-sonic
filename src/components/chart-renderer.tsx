'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  BubbleController,
  ScatterController,
  TimeScale,
  TimeSeriesScale
} from 'chart.js'
import {
  Chart,
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
  Radar,
  Scatter,
  Bubble
} from 'react-chartjs-2'
import { ChartType, CHART_CONFIGS } from '@/lib/chart-types'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  BubbleController,
  ScatterController,
  TimeScale,
  TimeSeriesScale
)

interface ChartRendererProps {
  type: ChartType
  data: any
  title?: string
  width?: number
  height?: number
  options?: any
}

export function ChartRenderer({ 
  type, 
  data, 
  title, 
  width = 400, 
  height = 300, 
  options 
}: ChartRendererProps) {
  const defaultOptions = {
    ...CHART_CONFIGS[type] || {},
    ...options,
    plugins: {
      ...CHART_CONFIGS[type]?.plugins || {},
      ...options?.plugins || {},
      title: {
        ...CHART_CONFIGS[type]?.plugins?.title || {},
        ...options?.plugins?.title || {},
        text: title || options?.plugins?.title?.text || ''
      }
    }
  }

  const chartProps = {
    data,
    options: defaultOptions,
    width,
    height
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar {...chartProps} />
      case 'line':
        return <Line {...chartProps} />
      case 'pie':
        return <Pie {...chartProps} />
      case 'doughnut':
        return <Doughnut {...chartProps} />
      case 'polarArea':
        return <PolarArea {...chartProps} />
      case 'radar':
        return <Radar {...chartProps} />
      case 'scatter':
        return <Scatter {...chartProps} />
      case 'bubble':
        return <Bubble {...chartProps} />
      case 'area':
        return <Line {...chartProps} options={{
          ...defaultOptions,
          plugins: {
            ...defaultOptions.plugins,
            filler: {
              propagate: false
            }
          }
        }} />
      default:
        return <div className="flex items-center justify-center h-full text-gray-500">
          Chart type "{type}" not supported yet
        </div>
    }
  }

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  )
}

// Specialized chart components for advanced types
export function GaugeChart({ value, max = 100, title, color = '#3B82F6' }: {
  value: number
  max?: number
  title?: string
  color?: string
}) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {value} / {max}
      </div>
    </div>
  )
}

export function FunnelChart({ data, title }: { data: Array<{ label: string; value: number }>, title?: string }) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="space-y-2">
        {data.map((item, index) => {
          const width = (item.value / maxValue) * 100
          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
          const color = colors[index % colors.length]
          
          return (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-700 mr-4">
                {item.label}
              </div>
              <div className="flex-1 relative">
                <div 
                  className="h-8 rounded-r-lg flex items-center justify-end pr-4 text-white font-medium"
                  style={{ 
                    width: `${width}%`, 
                    backgroundColor: color 
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function WaterfallChart({ data, title }: { data: Array<{ label: string; value: number; type?: 'start' | 'end' | 'positive' | 'negative' }>, title?: string }) {
  let runningTotal = 0
  const processedData = data.map((item, index) => {
    let start = runningTotal
    let end = runningTotal
    
    if (item.type === 'start') {
      end = item.value
      runningTotal = item.value
    } else if (item.type === 'end') {
      start = runningTotal
      end = item.value
    } else if (item.type === 'positive') {
      start = runningTotal
      end = runningTotal + item.value
      runningTotal += item.value
    } else if (item.type === 'negative') {
      start = runningTotal
      end = runningTotal - item.value
      runningTotal -= item.value
    } else {
      start = runningTotal
      end = runningTotal + item.value
      runningTotal += item.value
    }
    
    return { ...item, start, end }
  })

  const maxValue = Math.max(...processedData.map(d => Math.max(d.start, d.end)))
  const minValue = Math.min(...processedData.map(d => Math.min(d.start, d.end)))
  const range = maxValue - minValue

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="space-y-2">
        {processedData.map((item, index) => {
          const height = Math.abs(item.end - item.start) / range * 200
          const top = (maxValue - Math.max(item.start, item.end)) / range * 200
          const isPositive = item.end > item.start
          const color = isPositive ? '#10B981' : '#EF4444'
          
          return (
            <div key={index} className="flex items-end h-12">
              <div className="w-24 text-sm font-medium text-gray-700 mr-4 flex items-center">
                {item.label}
              </div>
              <div className="flex-1 relative h-48">
                <div 
                  className="absolute w-8 rounded-t"
                  style={{ 
                    height: `${height}px`,
                    top: `${top}px`,
                    backgroundColor: color,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-medium">
                  {item.value > 0 ? '+' : ''}{item.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function HeatmapChart({ data, title }: { 
  data: Array<{ x: string; y: string; value: number }>, 
  title?: string 
}) {
  const xLabels = [...new Set(data.map(d => d.x))].sort()
  const yLabels = [...new Set(data.map(d => d.y))].sort()
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${xLabels.length + 1}, 1fr)` }}>
        {/* Header row */}
        <div></div>
        {xLabels.map(label => (
          <div key={label} className="text-xs font-medium text-center p-2 bg-gray-100">
            {label}
          </div>
        ))}
        
        {/* Data rows */}
        {yLabels.map(yLabel => (
          <React.Fragment key={yLabel}>
            <div className="text-xs font-medium p-2 bg-gray-100 flex items-center">
              {yLabel}
            </div>
            {xLabels.map(xLabel => {
              const item = data.find(d => d.x === xLabel && d.y === yLabel)
              const value = item?.value || 0
              const intensity = (value - minValue) / (maxValue - minValue)
              const color = `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`
              
              return (
                <div 
                  key={`${xLabel}-${yLabel}`}
                  className="p-2 text-xs text-center border"
                  style={{ backgroundColor: color }}
                >
                  {value}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function TreemapChart({ data, title }: { 
  data: Array<{ name: string; value: number; children?: Array<{ name: string; value: number }> }>, 
  title?: string 
}) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => {
          const percentage = (item.value / totalValue) * 100
          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
          const color = colors[index % colors.length]
          
          return (
            <div 
              key={index}
              className="p-4 rounded-lg text-white relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <div className="font-semibold text-lg">{item.name}</div>
              <div className="text-sm opacity-90">{item.value}</div>
              <div className="text-xs opacity-75">{percentage.toFixed(1)}%</div>
              
              {item.children && (
                <div className="mt-2 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <div key={childIndex} className="text-xs opacity-80">
                      {child.name}: {child.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
