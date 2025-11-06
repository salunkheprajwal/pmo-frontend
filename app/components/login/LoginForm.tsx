'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '../shared/Input'
import Button from '../shared/Button'
import { useApi } from '@/app/context/ApiContext'
import { useToken } from '@/app/context/TokenContext'

const LoginForm = () => {
  const router = useRouter()
  const api = useApi()
  const { setToken } = useToken()
  const [identifier, setIdentifier] = useState('') // Changed from email to identifier
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('') // Store actual email from backend response

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)
    try {
      // Send identifier as 'email' field (backend handles both email and employeeId)
      const { ok, data } = await api.login(identifier, password)

      if (!ok) {
        setError(data?.message || 'Login failed')
        setIsLoading(false)
        return
      }

      if (data?.status) {
        // Store the actual email from response (in case user logged in with employeeId)
        if (data.email) {
          setUserEmail(data.email)
        }
        setMessage(data.message || 'OTP sent to your email')
        setStep('otp')
      } else {
        setError(data?.message || 'Login failed')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)
    try {
      // Use the actual email from backend response for OTP verification
      const emailForVerification = userEmail || identifier
      const { ok, data } = await api.verify(emailForVerification, otp)

      if (!ok) {
        setError(data?.message || 'OTP verification failed')
        setIsLoading(false)
        return
      }

      if (data?.status) {
        // Store token if present
        if (data.token) {
          setToken(data.token)
        }
        router.push('/authenticated/dashboard')
      } else {
        setError(data?.message || 'OTP verification failed')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError(null)
    setMessage(null)
    try {
      // Use the identifier and password for resending OTP
      const { ok, data } = await api.resendOtp(identifier, password)
      if (ok && data?.status) {
        setMessage('OTP resent to your email')
        // Update email if returned in response
        if (data.email) {
          setUserEmail(data.email)
        }
      } else {
        setError(data?.message || 'Failed to resend OTP')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-surface rounded-2xl shadow-xl p-6">
      <div className="text-center mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-2 mt-1">Sign in to continue</p>
      </div>

      {error && <div className="text-sm text-danger mb-2">{error}</div>}
      {message && <div className="text-sm text-success mb-2">{message}</div>}

      {step === 'login' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Employee ID"
            type="text"
            placeholder="you@example.com or EMP123"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />  

          <Button type="submit" variant="primary" isLoading={isLoading} fullWidth>
            Sign in
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            label="One Time Password (OTP)"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-muted-2 underline"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginForm
