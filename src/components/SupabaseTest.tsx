import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<{url: boolean, key: boolean}>({url: false, key: false})

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check environment variables first
        const hasUrl = !!import.meta.env.VITE_SUPABASE_URL
        const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY
        
        setEnvVars({ url: hasUrl, key: hasKey })

        if (!hasUrl || !hasKey) {
          setStatus('❌ Environment variables missing')
          setError('Please check your .env.local file')
          return
        }

        // Test the connection with a simple query
        const { data, error } = await supabase
          .from('students')
          .select('count')
          .limit(1)

        if (error) {
          // If table doesn't exist yet, that's okay - connection is working
          if (error.message.includes('relation "students" does not exist')) {
            setStatus('✅ Supabase connection successful!')
            setError('Note: Database tables not created yet')
          } else {
            setStatus('❌ Connection error')
            setError(`Error: ${error.message}`)
          }
        } else {
          setStatus('✅ Supabase connection successful!')
        }
      } catch (err) {
        setStatus('❌ Connection failed')
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🔌 Supabase Connection Test</h2>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-700 font-medium">{status}</p>
        </div>

        {/* Environment Variables Check */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Project URL</p>
            <p className={`font-medium ${envVars.url ? 'text-green-600' : 'text-red-600'}`}>
              {envVars.url ? '✅ Set' : '❌ Missing'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">API Key</p>
            <p className={`font-medium ${envVars.key ? 'text-green-600' : 'text-red-600'}`}>
              {envVars.key ? '✅ Set' : '❌ Missing'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Create database tables in Supabase SQL Editor</li>
            <li>• Insert sample data</li>
            <li>• Update components to use real data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SupabaseTest
