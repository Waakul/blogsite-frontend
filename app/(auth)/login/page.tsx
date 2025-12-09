'use client'

import React, { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { PersonIcon, LockClosedIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { config } from '../../config'
import Link from 'next/link'

export default function LoginPage(): JSX.Element {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [show, setShow] = useState(false)

    function validate() {
        if (!username.trim()) return 'Username is required'
        if (!password) return 'Password is required'
        if (password.length < 6) return 'Password must be at least 6 characters'
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
            const response = await fetch(`${config.api_url}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Login failed')
            }

            document.cookie = `sessionId=${(await response.json()).sessionId}; path=/; max-age=604800;`
        
            window.location.href = '/'
        } catch {
            setError('Login failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main className="page">
                <div className="card" role="main" aria-labelledby="login-heading">
                    <header className="cardHeader">
                        <h1 id="login-heading">Welcome back to BlogIt.</h1>
                    </header>

                    <form onSubmit={onSubmit} className="form" noValidate>
                        <div className="field">
                            <Label.Root className="label" htmlFor="username">
                                Username
                            </Label.Root>
                            <div className="inputWrap">
                                <PersonIcon className="icon" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input"
                                    placeholder="your-username"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <Label.Root className="label" htmlFor="password">
                                Password
                            </Label.Root>
                            <div className="inputWrap">
                                <LockClosedIcon className="icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={show ? 'text' : 'password'}
                                    autoComplete="current-password"
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

                        {error && (
                            <div role="alert" className="error">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <footer className="cardFooter">
                        <Link href="/forgotpassword" className="link">
                            Forgot password?
                        </Link>
                        <Link href="/register" className="link">
                            Create account
                        </Link>
                    </footer>
                </div>
            </main>
        </>
    )
}
