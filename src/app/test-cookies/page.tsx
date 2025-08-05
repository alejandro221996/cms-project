'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function TestCookiesPage() {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState<string>('')

  const testCookies = async () => {
    try {
      const response = await fetch('/api/trpc/settings.getLayout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setTestResult(`Status: ${response.status}\nHeaders: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)
    } catch (error) {
      setTestResult(`Error: ${error}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Cookies</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Session Status: {status}</h2>
        {session && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Session Info:</h3>
            <p>User: {session.user?.name}</p>
            <p>Email: {session.user?.email}</p>
            <p>Role: {session.user?.role}</p>
            <p>ID: {session.user?.id}</p>
          </div>
        )}
      </div>

      <button 
        onClick={testCookies}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test TRPC Request
      </button>

      {testResult && (
        <div className="mt-4">
          <h3 className="font-semibold">Test Result:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  )
} 