import { useEffect, useRef, useState } from 'react'

import Navbar from '../components/navbar'
import MlPredictionCard from '../components/MlPredictionCard'
import '../placement-ml.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// Ranges match the backend model (PlacementProfile.js)
const FIELDS = [
  { group: 'Academics', key: 'cgpa', label: 'CGPA', min: 0, max: 10, step: 0.01 },
  { group: 'Academics', key: 'backlogs', label: 'Active backlogs', min: 0, max: 30, step: 1 },
  { group: 'Academics', key: 'attendancePct', label: 'Attendance (%)', min: 0, max: 100, step: 1 },

  { group: 'Skill scores (0-100)', key: 'codingSkillScore', label: 'Coding', min: 0, max: 100, step: 1 },
  { group: 'Skill scores (0-100)', key: 'dsaScore', label: 'Data structures and algorithms', min: 0, max: 100, step: 1 },
  { group: 'Skill scores (0-100)', key: 'coreCsScore', label: 'Core CS subjects', min: 0, max: 100, step: 1 },
  { group: 'Skill scores (0-100)', key: 'aptitudeScore', label: 'Aptitude', min: 0, max: 100, step: 1 },
  { group: 'Skill scores (0-100)', key: 'communicationScore', label: 'Communication', min: 0, max: 100, step: 1 },
  { group: 'Skill scores (0-100)', key: 'englishScore', label: 'English', min: 0, max: 100, step: 1 },

  { group: 'Weekly practice', key: 'codingHoursPerWeek', label: 'Coding hours per week', min: 0, max: 100, step: 1 },
  { group: 'Weekly practice', key: 'interviewPracticeHoursPerWeek', label: 'Interview practice hours per week', min: 0, max: 100, step: 1 }
]

const GROUPS = [...new Set(FIELDS.map((field) => field.group))]

const EMPTY_FORM = {
  ...Object.fromEntries(FIELDS.map((field) => [field.key, ''])),
  degree: '',
  branch: ''
}

function getToken() {
  return localStorage.getItem('token')
}

function PlacementProfile() {
  const formRef = useRef(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [hasProfile, setHasProfile] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API_URL}/api/placement-profile`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong')
        }

        if (data.profile) {
          const next = { ...EMPTY_FORM }

          FIELDS.forEach((field) => {
            next[field.key] = String(data.profile[field.key] ?? '')
          })

          next.degree = data.profile.degree || ''
          next.branch = data.profile.branch || ''

          setForm(next)
          setHasProfile(true)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  function handleChange(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setMessage('')

    const body = {
      degree: form.degree.trim(),
      branch: form.branch.trim()
    }

    for (const field of FIELDS) {
      const raw = form[field.key]

      if (raw === '') {
        setError(`${field.label} is required`)
        return
      }

      const value = Number(raw)

      if (Number.isNaN(value) || value < field.min || value > field.max) {
        setError(`${field.label} must be between ${field.min} and ${field.max}`)
        return
      }

      body[field.key] = value
    }

    setSaving(true)

    try {
      const response = await fetch(`${API_URL}/api/placement-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setHasProfile(true)
      setMessage('Details saved.')
      setRefreshKey((current) => current + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar />

      <section className="dashboard-content ml-page">
        <div className="dashboard-intro">
          <div>
            <h1>Placement prediction</h1>
            <p>
              Enter your academic details and practice habits. We combine them
              with your resume and mock interview results to estimate how ready
              you are.
            </p>
          </div>
        </div>

        {loading && <div className="dashboard-message">Loading your details...</div>}

        {!loading && (
          <div className="ml-layout">
            <form className="ml-form" onSubmit={handleSubmit} ref={formRef} noValidate>
              {GROUPS.map((group) => (
                <fieldset className="ml-fieldset" key={group}>
                  <legend>{group}</legend>

                  <div className="ml-fields">
                    {FIELDS.filter((field) => field.group === group).map((field) => (
                      <label className="ml-field" key={field.key}>
                        <span>{field.label}</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={form[field.key]}
                          onChange={(event) => handleChange(field.key, event.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              <fieldset className="ml-fieldset">
                <legend>Optional</legend>

                <div className="ml-fields">
                  <label className="ml-field">
                    <span>Degree (for example BTech)</span>
                    <input
                      type="text"
                      value={form.degree}
                      onChange={(event) => handleChange('degree', event.target.value)}
                    />
                  </label>

                  <label className="ml-field">
                    <span>Branch (for example CSE)</span>
                    <input
                      type="text"
                      value={form.branch}
                      onChange={(event) => handleChange('branch', event.target.value)}
                    />
                  </label>
                </div>

                <p className="ml-hint">
                  Leave these blank to use the education saved in your resume.
                </p>
              </fieldset>

              {error && <div className="dashboard-message dashboard-message-error">{error}</div>}
              {message && <div className="ml-success">{message}</div>}

              <button type="submit" className="ml-submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save and predict'}
              </button>
            </form>

            <div className="ml-result">
              {hasProfile ? (
                <MlPredictionCard
                  refreshKey={refreshKey}
                  onEditProfile={() =>
                    formRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                />
              ) : (
                <div className="ml-card ml-card-note">
                  Fill in the form and save to see your prediction here.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default PlacementProfile
