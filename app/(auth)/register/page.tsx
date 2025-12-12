'use client'

import React, { JSX, useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { PersonIcon, LockClosedIcon, EnvelopeClosedIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { config } from '../../config'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


export default function RegisterPage(): JSX.Element {
    const [displayName, setDisplayName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [screen, setScreen] = useState('register')
    const [error, setError] = useState<string | null>(null)
    const [show, setShow] = useState(false)

    const router = useRouter();

    function validate() {
        if (!displayName.trim()) return 'Display name is required'
        if (!username.trim()) return 'Username is required'
        if (!email.trim()) return 'Email is required'
        if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address'
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
            const response = await fetch(`${config.api_url}/auth/register/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email}),
            })
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 400) {return setError('User with this username already exists.')};
                return setError(data.message || 'Error Sending OTP.');
            }
            // replace the form with an OTP entry UI and wire up handlers
            setScreen('otp');

            // DOM will update on the next render pass — defer querying and wiring
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
                            const res = await fetch(`${config.api_url}/auth/register/user/verify-otp`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username, email, displayName, password, otpCode:otp }),
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

                            // success -> redirect to login
                            router.push('/login')
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
            setError('Registration failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main className="page">
                <div className="card" role="main" aria-labelledby="register-heading">
                    { screen === 'register' ? (
                    <>
                        <header className="cardHeader">
                        <h1 id="register-heading">Create your BlogIt account</h1>
                    </header>

                    <form onSubmit={onSubmit} className="form" noValidate>
                        <div className="field">
                            <Label.Root className="label" htmlFor="displayName">
                                Display Name
                            </Label.Root>
                            <div className="inputWrap">
                                <PersonIcon className="icon" />
                                <input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    autoComplete="name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="input"
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>

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
                            <Label.Root className="label" htmlFor="email">
                                Email
                            </Label.Root>
                            <div className="inputWrap">
                                <EnvelopeClosedIcon className="icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                    placeholder="you@example.com"
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

                        {/* confirm password field */}
                        <div className="field" style={{ marginTop: 6 }}>
                            <Label.Root className="label" htmlFor="confirmPassword">
                                Confirm Password
                            </Label.Root>
                            <div className="inputWrap">
                                <LockClosedIcon className="icon" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    className="input"
                                    placeholder="••••••••"
                                    onInput={(e) => {
                                        const val = (e.currentTarget as HTMLInputElement).value
                                        const pw = (document.getElementById('password') as HTMLInputElement | null)?.value || ''
                                        const err = document.getElementById('confirmError') as HTMLDivElement | null
                                        if (!err) return
                                        if (val && val !== pw) {
                                            err.textContent = 'Passwords do not match'
                                            err.style.display = 'block'
                                        } else {
                                            err.style.display = 'none'
                                        }
                                    }}
                                />
                            </div>

                            <div
                                id="confirmError"
                                role="alert"
                                style={{
                                    display: 'none',
                                    color: '#ffb4b4',
                                    background: 'rgba(255,75,75,0.06)',
                                    border: '1px solid rgba(255,75,75,0.12)',
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    marginTop: '8px',
                                }}
                            />
                        </div>

                        {/* capture-phase submit guard to prevent sending OTP when passwords don't match */}
                        {(() => {
                            setTimeout(() => {
                                const card = document.querySelector('.card')
                                const form = card?.querySelector('form')
                                if (!form) return

                                const submitCaptureHandler = (e: any) => {
                                    const pw = (document.getElementById('password') as HTMLInputElement | null)?.value || ''
                                    const cp = (document.getElementById('confirmPassword') as HTMLInputElement | null)?.value || ''
                                    if (cp && pw !== cp) {
                                        e.preventDefault()
                                        const err = document.getElementById('confirmError') as HTMLDivElement | null
                                        if (err) {
                                            err.textContent = 'Passwords do not match'
                                            err.style.display = 'block'
                                        }
                                    }
                                }

                                // avoid adding multiple listeners
                                if (!(form as any).__pwConfirmAdded) {
                                    form.addEventListener('submit', submitCaptureHandler, true)
                                    ;(form as any).__pwConfirmAdded = true
                                }
                            }, 50)
                            return null
                        })()}
                        </div>

                        {error && (
                            <div role="alert" className="error">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Sending OTP…' : 'Send OTP to Email'}
                        </button>
                    </form>

                    <footer className="cardFooter">
                        <Link href="/login" className="link">
                            Already have an account?
                        </Link>
                        <Link href="/forgotpassword" className="link">
                            Forgot password?
                        </Link>
                    </footer>
                    </>
                    ) : (
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
                            Already have an account?
                          </Link>
                          <Link href="/forgotpassword" className="link">
                            Forgot password?
                          </Link>
                        </footer>
                      </>
                    )
                    }
                </div>
            </main>
        </>
    )
}