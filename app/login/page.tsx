'use client'

import React, { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { PersonIcon, LockClosedIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { slateDark, mauveDark, amber } from '@radix-ui/colors'
import { config } from '../config'
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

            localStorage.setItem('sessionId', (await response.json()).sessionId)
        
            window.location.href = '/'
        } catch {
            setError('Login failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const radixVars = `
        :root {
            /* dark-only theme using Radix dark tokens */
            --bg: ${slateDark.slate1};
            --card: ${slateDark.slate3};
            --muted: ${slateDark.slate9};
            --text: ${slateDark.slate12};
            --accent: ${amber.amber9};
            --input-bg: ${mauveDark.mauve2};
            --ring: color-mix(in srgb, ${amber.amber9} 18%, transparent);
        }
    `

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

            <style jsx>{`
                ${radixVars}

                * {
                    box-sizing: border-box;
                }
                html,
                body,
                :root {
                    height: 100%;
                }
                body {
                    margin: 0;
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
                    background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 94%, #0000) 100%);
                    color: var(--text);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                .page {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 24px;
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
                    background: url('/login-bg.jpg') no-repeat center center;
                    background-color: rgb(0 0 0 / 83%);
                    background-blend-mode: multiply;
                    background-size: cover;
                    color: var(--text);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                .card {
                    width: 100%;
                    max-width: 420px;
                    background: var(--card);
                    border: 1px solid color-mix(in srgb, var(--card), black 6%);
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 6px 30px color-mix(in srgb, var(--bg), black 60%);
                }

                .cardHeader {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 18px;
                }

                h1 {
                    margin: 0;
                    font-size: 20px;
                    letter-spacing: -0.2px;
                }

                .form {
                    display: grid;
                    gap: 12px;
                }
                .field {
                    display: grid;
                    gap: 6px;
                }
                .label {
                    font-size: 13px;
                    color: var(--muted);
                }

                .inputWrap {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    background: linear-gradient(180deg, color-mix(in srgb, var(--input-bg), white 2%), transparent);
                    border: 1px solid color-mix(in srgb, var(--input-bg), black 6%);
                    padding: 10px 12px;
                    border-radius: 8px;
                }

                .icon {
                    width: 18px;
                    height: 18px;
                    color: var(--muted);
                    flex: 0 0 18px;
                }

                .input {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--text);
                    font-size: 15px;
                    width: 100%;
                }
                .input::placeholder {
                    color: color-mix(in srgb, var(--muted), black 30%);
                }

                .input:focus-visible {
                    box-shadow: 0 0 0 4px var(--ring);
                    border-radius: 6px;
                }

                .error {
                    color: #ffb4b4;
                    background: rgba(255, 75, 75, 0.06);
                    border: 1px solid rgba(255, 75, 75, 0.12);
                    padding: 8px 10px;
                    border-radius: 8px;
                    font-size: 13px;
                }

                .submit {
                    margin-top: 4px;
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 10px;
                    border: none;
                    cursor: pointer;
                    background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent), black 10%));
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 6px 20px color-mix(in srgb, var(--accent), black 82%);
                }
                .submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .cardFooter {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    gap: 12px;
                    font-size: 13px;
                }
                .link {
                    color: var(--muted);
                    font-size: 13px;
                    text-decoration: none;
                }
                .link:hover {
                    color: var(--text);
                    text-decoration: underline;
                }
            `}</style>
        </>
    )
}
