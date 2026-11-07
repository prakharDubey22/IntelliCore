import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })

    setError('')
  }



async function handleSubmit(event) {
  event.preventDefault()
  setError('')

  if (
    !formData.fullName.trim() ||
    !formData.email.trim() ||
    !formData.mobile.trim() ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError('Please fill in all the fields.')
    return
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters.')
    return
  }

  try {
    setIsCreating(true)

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }
    )

    console.log('Registration successful:', response.data)
    navigate('/login')
  } catch (error) {
    setError(
      error.response?.data?.message ||
      'Registration failed. Please try again.'
    )
  } finally {
    setIsCreating(false)
  }
}



  return (
    <div className="register-page">

      {/* Brand */}
      <div className="register-brand">

        <div className="register-logo">
          I
        </div>

        <div>
          <h1>IntelliCore</h1>
          <p>AI-Powered Career Intelligence</p>
        </div>

      </div>


      {/* Register Container */}
      <div className="register-container">

        <div className="register-card">

          {/* Header */}
          <div className="register-card-header">

            <span className="card-eyebrow">
              GET STARTED
            </span>

            <h2>
              Create your account.
            </h2>

            <p>
              Start your personalized placement journey with IntelliCore.
            </p>

          </div>


          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="register-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />

            </div>


            {/* Email */}
            <div className="register-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            {/* Mobile */}
            <div className="register-field">

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                placeholder="+91 XXXXX XXXXX"
                value={formData.mobile}
                onChange={handleChange}
              />

            </div>


            {/* Password Row */}
            <div className="register-form-row">

              <div className="register-field">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />

              </div>


              <div className="register-field">

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* Error */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            {/* Terms */}
            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Privacy Policy.
              </span>

            </label>


            {/* Submit */}
            <button
              type="submit"
              className="register-button"
              disabled={isCreating}
            >
              {isCreating
                ? 'Creating Account...'
                : 'Create My Account'}

              {!isCreating && (
                <span>→</span>
              )}

            </button>

          </form>


          {/* Login */}
          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>

          </div>

        </div>


        {/* Footer */}
        <div className="register-footer">

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

export default Register
