import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const navigate = useNavigate()

  function handleLogin(event) {
    event.preventDefault()

    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoggingIn(true)

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem('token', response.data.token)
        navigate('/introduction')
      })
      .catch((error) => {
        setError(error.response?.data?.message || 'Login failed')
      })
      .finally(() => {
        setIsLoggingIn(false)
      })
  }

  return (
    <div className="login-page">

      <div className="login-brand">

        <div className="login-logo">
          I
        </div>

        <div>
          <h1>IntelliCore</h1>
          <p>AI-Powered Career Intelligence</p>
        </div>

      </div>


      <div className="login-container">

        <div className="login-card">

          <div className="login-card-header">

            <span className="card-eyebrow">
              WELCOME BACK
            </span>

            <h2>
              Continue your journey.
            </h2>

            <p>
              Sign in to access your personalized placement
              intelligence dashboard.
            </p>

          </div>


          <form onSubmit={handleLogin}>

            <div className="login-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
              />

            </div>


            <div className="login-field">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
              />

            </div>


            <div className="login-options">

              <label className="remember-me">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="login-button"
              disabled={isLoggingIn}
            >

              {isLoggingIn
                ? 'Signing In...'
                : 'Sign In'
              }

              {!isLoggingIn && (
                <span>→</span>
              )}

            </button>

          </form>


          <div className="login-divider">
            <span>OR</span>
          </div>


          <div className="login-register">
            <span>New to IntelliCore?</span>

            <button
            type="button"
            onClick={() => navigate('/register')}
           >
             Create an account
             </button>
          </div>

        </div>


        <div className="login-footer">

          <span>
            Intelligent preparation.
          </span>

          <span>•</span>

          <span>
            Better placement readiness.
          </span>

        </div>

      </div>

    </div>
  )
}

export default Login