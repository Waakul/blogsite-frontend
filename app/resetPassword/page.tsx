'use client'

import React, { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { LockClosedIcon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { slateDark, mauveDark, amber } from '@radix-ui/colors'
import { useSearchParams } from 'next/navigation'
import { config } from '../config'
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

    const radixVars = `
        :root {
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

            <style jsx>{`
                ${radixVars}

                * { box-sizing: border-box; }
                html, body, :root { height: 100%; }

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

                h1 { margin: 0; font-size: 20px; }

                .form { display: grid; gap: 12px; }
                .field { display: grid; gap: 6px; }
                .label { font-size: 13px; color: var(--muted); }

                .inputWrap {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    background: linear-gradient(180deg, color-mix(in srgb, var(--input-bg), white 2%), transparent);
                    border: 1px solid color-mix(in srgb, var(--input-bg), black 6%);
                    padding: 10px 12px;
                    border-radius: 8px;
                }

                .icon { width: 18px; height: 18px; color: var(--muted); flex: 0 0 18px; }

                .input {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--text);
                    font-size: 15px;
                    width: 100%;
                }
                .input::placeholder { color: color-mix(in srgb, var(--muted), black 30%); }
                .input:focus-visible { box-shadow: 0 0 0 4px var(--ring); border-radius: 6px; }

                .eye {
                    background: transparent;
                    border: none;
                    color: var(--muted);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    cursor: pointer;
                    flex: 0 0 28px;
                }

                .error {
                    color: #ffb4b4;
                    background: rgba(255, 75, 75, 0.06);
                    border: 1px solid rgba(255, 75, 75, 0.12);
                    padding: 8px 10px;
                    border-radius: 8px;
                    font-size: 13px;
                }

                .success {
                    color: #b8fbb8;
                    background: rgba(40, 200, 40, 0.06);
                    border: 1px solid rgba(40, 200, 40, 0.12);
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 14px;
                    text-align: center;
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
                .submit:disabled { opacity: 0.6; cursor: not-allowed; }

                .cardFooter {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    gap: 12px;
                    font-size: 13px;
                }
                .link { color: var(--muted); font-size: 13px; text-decoration: none; }
                .link:hover { color: var(--text); text-decoration: underline; }
            `}</style>
        </>
    )
}