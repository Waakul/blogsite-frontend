'use client'

import React, { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { PersonIcon } from '@radix-ui/react-icons'
import { slateDark, mauveDark, amber } from '@radix-ui/colors'
import { config } from '../config'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage(): JSX.Element {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [screen, setScreen] = useState('main')

    const router = useRouter();

    function validate() {
        if (!username.trim()) return 'Username is required'
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
            const response = await fetch(`${config.api_url}/auth/forgotPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Request failed')
            }
            
            setScreen('otp')

            setTimeout(() => {
const card = document.querySelector('.card')
                if (!card) {
                    return
                }

                // wire up OTP input behavior and submission
                const otpInputs = Array.from(card.querySelectorAll('.otpBox')) as HTMLInputElement[];
                const otpForm = card.querySelector('#otpForm') as HTMLFormElement;
                const otpError = card.querySelector('#otpError') as HTMLDivElement;
                const otpSubmit = card.querySelector('#otpSubmit') as HTMLButtonElement;

                if (otpInputs.length === 6) {
                    otpInputs.forEach((input, idx) => {
                        input.addEventListener('input', (e) => {
                            const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
                            input.value = val
                            if (val && idx < otpInputs.length - 1) {
                                otpInputs[idx + 1].focus()
                            }
                        })
                        input.addEventListener('keydown', (e) => {
                            if (e.key === 'Backspace' && !input.value && idx > 0) {
                                otpInputs[idx - 1].focus()
                            }
                            if (e.key === 'ArrowLeft' && idx > 0) {
                                otpInputs[idx - 1].focus()
                            }
                            if (e.key === 'ArrowRight' && idx < otpInputs.length - 1) {
                                otpInputs[idx + 1].focus()
                            }
                        })
                    })
                    // focus first box
                    setTimeout(() => otpInputs[0].focus(), 50)
                }

                if (otpForm) {
                    otpForm.addEventListener('submit', async (e) => {
                        e.preventDefault()
                        if (otpError) otpError.style.display = 'none'
                        const otp = otpInputs.map(i => i.value).join('')
                        if (!/^\d{6}$/.test(otp)) {
                            if (otpError) {
                                otpError.textContent = 'Please enter the 6-digit OTP.'
                                otpError.style.display = 'block'
                            }
                            return
                        }

                        if (otpSubmit) {
                            otpSubmit.disabled = true
                            otpSubmit.textContent = 'Verifying…'
                        }

                        try {
                            const res = await fetch(`${config.api_url}/auth/forgotPassword/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username,  otpCode:otp }),
                            })
                            if (!res.ok) {
                                const data = await res.json().catch(() => ({}))
                                if (otpError) {
                                    otpError.textContent = data?.message || 'OTP verification failed'
                                    otpError.style.display = 'block'
                                }
                                if (otpSubmit) {
                                    otpSubmit.disabled = false
                                    otpSubmit.textContent = 'Verify OTP'
                                }
                                return
                            }

                            console.log(await res.json())

                            router.push(`/resetPassword?resetToken=${(await res.json()).resetToken}`)
                        } catch {
                            if (otpError) {
                                otpError.textContent = 'Network error. Try again.'
                                otpError.style.display = 'block'
                            }
                            if (otpSubmit) {
                                otpSubmit.disabled = false
                                otpSubmit.textContent = 'Verify OTP'
                            }
                        }
                    })
                }
            }, 50)
        } catch {
            setError('Request failed. Try again.')
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
                <div className="card" role="main" aria-labelledby="forgot-heading">
                { screen === 'main' ? (
                    <>
                    <header className="cardHeader">
                        <h1 id="forgot-heading">Forgot your password?</h1>
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

                        {error && (
                            <div role="alert" className="error">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Getting OTP…' : 'Get OTP in Email'}
                        </button>
                    </form>

                    <footer className="cardFooter">
                    <Link href="/login" className="link">
                            Go back to login
                          </Link>
                          <Link href="/register" className="link">
                            Create New Account
                          </Link>
                    </footer>
                    </> )
                    : (
                        <>
                        <header className="cardHeader">
                          <h1 id="verify-heading">Enter OTP</h1>
                        </header>
                  
                        <div
                          className="sub"
                          style={{
                            color: "var(--muted)",
                            fontSize: "13px",
                            marginBottom: "12px",
                          }}
                        >
                          OTP successfully sent to email, Please enter it below
                        </div>
                  
                        <form id="otpForm" className="form" noValidate>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "center",
                              marginBottom: "8px",
                            }}
                          >
                            {Array.from({ length: 6 }).map((_, i) => (
                              <input
                                key={i}
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={1}
                                className="otpBox"
                                style={{
                                  width: "44px",
                                  height: "56px",
                                  textAlign: "center",
                                  fontSize: "20px",
                                  borderRadius: "8px",
                                  border:
                                    "1px solid color-mix(in srgb, var(--input-bg), black 6%)",
                                  background: "var(--card)",
                                  color: "var(--text)",
                                }}
                              />
                            ))}
                          </div>
                  
                          <div
                            id="otpError"
                            role="alert"
                            style={{
                              display: "none",
                              color: "#ffb4b4",
                              background: "rgba(255,75,75,0.06)",
                              border: "1px solid rgba(255,75,75,0.12)",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              marginBottom: "8px",
                            }}
                          ></div>
                  
                          {/* use the same submit button styling as the main form */}
                          <button
                            id="otpSubmit"
                            type="submit"
                            className="submit"
                            aria-live="polite"
                          >
                            Verify OTP
                          </button>
                        </form>
                  
                        <footer className="cardFooter" style={{ marginTop: "12px" }}>
                          <Link href="/login" className="link">
                            Go back to login
                          </Link>
                          <Link href="/register" className="link">
                            Create New Account
                          </Link>
                        </footer>
                      </>
                    )
                    }
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