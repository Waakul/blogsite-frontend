'use client'

import React, { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { LockClosedIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { useSearchParams } from 'next/navigation'
import { config } from '../../config'
import Link from 'next/link'

export default function ResetPasswordPage(): JSX.Element {
    const search = useSearchParams()
    const token = search?.get('resetToken') ?? ''
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    function validate() {
        if (!password) return 'Password is required'
        if (password.length < 6) return 'Password must be at least 6 characters'
        if (!confirm) return 'Please confirm your password'
        if (password !== confirm) return 'Passwords do not match'
        if (!token) return 'Missing reset token'
        return null
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        const err = validate()
        if (err) {
            setError(err)
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${config.api_url}/auth/forgotPassword/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken: token, newPassword: password }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setError(data?.message || 'Failed to reset password')
                return
            }
            setSuccess(true)
            // small delay so the user sees the success state
            setTimeout(() => (window.location.href = '/login'), 900)
        } catch {
            setError('Network error. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main className="page">
                <div className="card" role="main" aria-labelledby="reset-heading">
                    <header className="cardHeader">
                        <h1 id="reset-heading">Set a new password</h1>
                    </header>

                    {success ? (
                        <div className="success">
                            Password updated. Redirecting to login…
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="form" noValidate>
                            <div className="field">
                                <Label.Root className="label" htmlFor="password">
                                    New password
                                </Label.Root>
                                <div className="inputWrap">
                                    <LockClosedIcon className="icon" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={show ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        aria-label={show ? 'Hide password' : 'Show password'}
                                        onClick={() => setShow((s) => !s)}
                                        className="eye"
                                    >
                                        {show ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                    </button>
                                </div>
                            </div>

                            <div className="field">
                                <Label.Root className="label" htmlFor="confirm">
                                    Confirm password
                                </Label.Root>
                                <div className="inputWrap">
                                    <LockClosedIcon className="icon" />
                                    <input
                                        id="confirm"
                                        name="confirm"
                                        type={show ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div role="alert" className="error">
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="submit" disabled={loading}>
                                {loading ? 'Updating…' : 'Set new password'}
                            </button>
                        </form>
                    )}

                    <footer className="cardFooter">
                    <Link href="/login" className="link">
                            Go back to login
                          </Link>
                          <Link href="/register" className="link">
                            Create New Account
                          </Link>
                    </footer>
                </div>
            </main>
        </>
    )
}