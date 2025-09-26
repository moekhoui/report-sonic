import React, { useState, useCallback, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import { DynamicPromptModal } from './DynamicPromptModal'
import { UserPreferences, DataStructure } from '../types/dynamic-prompt'
import { detectDataStructure } from '../lib/prompt-generator'

interface EnhancedFileUploadProps {
  onFileUpload: (file: File, customPrompt?: string) => Promise<void>
  uploading: boolean
  className?: string
}

export function EnhancedFileUpload({ onFileUpload, uploading, className = '' }: EnhancedFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [dataStructure, setDataStructure] = useState<DataStructure | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['.xlsx', '.xls', '.csv']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExtension)) {
      setErrorMessage('Please upload only Excel (.xlsx, .xls) or CSV files')
      setUploadStatus('error')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB')
      setUploadStatus('error')
      return
    }

    setErrorMessage('')
    setUploadStatus('idle')
    
    // Store the file and show prompt modal
    setPendingFile(file)
    
    // Parse file to detect data structure for the prompt modal
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0]?.split(',') || []
      const rows = lines.slice(1).map(line => {
        const values = line.split(',')
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || ''
        })
        return obj
      })
      
      const detectedStructure = detectDataStructure(rows)
      setDataStructure(detectedStructure)
      setShowPromptModal(true)
    } catch (error) {
      // If parsing fails, proceed with upload without custom prompt
      await onFileUpload(file)
      setUploadStatus('success')
      setTimeout(() => setUploadStatus('idle'), 3000)
    }
  }

  const handleCustomAnalysis = async (preferences: UserPreferences) => {
    if (!pendingFile || !dataStructure) return

    setShowPromptModal(false)
    setUploadStatus('idle')
    
    try {
      // Generate custom prompt
      const { generateCustomPrompt } = await import('../lib/prompt-generator')
      const customPrompt = generateCustomPrompt(preferences, dataStructure, {
        dataStructure,
        analysisRequirements: {
          format: 'JSON',
          requiredSections: ['summary', 'insights', 'trends', 'qualityIssues', 'recommendations', 'statistics', 'businessApplications', 'riskOpportunities', 'nextSteps', 'dataRelationships'],
          maxTokens: 3000
        },
        technicalInstructions: {
          dataQualityCheck: true,
          patternDetection: true,
          statisticalAnalysis: true
        }
      })

      await onFileUpload(pendingFile, customPrompt)
      setUploadStatus('success')
      setTimeout(() => setUploadStatus('idle'), 3000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed')
      setUploadStatus('error')
    } finally {
      setPendingFile(null)
      setDataStructure(null)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const clearError = () => {
    setErrorMessage('')
    setUploadStatus('idle')
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Section */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInput}
          disabled={uploading}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            ) : uploadStatus === 'success' ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="w-12 h-12 text-red-500" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* Upload Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {uploading ? 'Processing your file...' : 
               uploadStatus === 'success' ? 'File uploaded successfully!' :
               uploadStatus === 'error' ? 'Upload failed' :
               'Upload your Excel or CSV file'}
            </h3>
            
            <p className="text-gray-600">
              {uploading ? 'AI is analyzing your data...' :
               uploadStatus === 'success' ? 'Your report is being generated' :
               uploadStatus === 'error' ? 'Please try again' :
               'Drag and drop your file here, or click to browse'}
            </p>
          </div>

          {/* File Requirements */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Supported formats: .xlsx, .xls, .csv</p>
            <p>Maximum file size: 10MB</p>
            <p>AI will analyze all columns and rows automatically</p>
          </div>

          {/* Upload Button (when not dragging) */}
          {!dragActive && !uploading && (
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Choose File
            </button>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{errorMessage}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Upload Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include headers in the first row for better analysis</li>
          <li>• AI will automatically detect and handle empty columns</li>
          <li>• Date columns will be recognized for time-series analysis</li>
          <li>• Numeric data will be used for statistical analysis</li>
          <li>• Text data will be analyzed for patterns and categories</li>
        </ul>
      </div>

      {/* Dynamic Prompt Modal */}
      {showPromptModal && dataStructure && (
        <DynamicPromptModal
          isOpen={showPromptModal}
          onClose={() => {
            setShowPromptModal(false)
            setPendingFile(null)
            setDataStructure(null)
          }}
          onAnalyze={handleCustomAnalysis}
          dataStructure={dataStructure}
          isAnalyzing={uploading}
        />
      )}
    </div>
  )
}
