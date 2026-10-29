import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/navbar'
import ScoreCard from '../components/ScoreCard'
import ResumeCard from '../components/ResumeCard'
import SkillGap from '../components/SkillGap'
import LearningRoadmap from '../components/LearningRoadmap'
import InterviewCard from '../components/InterviewCard'
import ReadinessCard from '../components/ReadinessCard'
import MlPredictionSummary from '../components/MlPredictionSummary'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001'

// Change these to match the routes in App.jsx
const PATHS = {
  resume: '/ats',
  skillGap: '/skills',
  roadmap: '/roadmap',
  interview: '/interview',
  readiness: '/readiness',
  mlPrediction: '/placement-profile'
}

function getToken() {
  return localStorage.getItem('token')
}

function Dashboard() {
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong')
        }

        setDashboard(data.dashboard)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <>
      <Navbar />

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <span className="dashboard-eyebrow">
              PLACEMENT INTELLIGENCE
            </span>

            <h1>Your Placement Dashboard</h1>

            <p>
              Track your resume quality, skills and overall placement
              readiness in one place.
            </p>
          </div>

          <div className="dashboard-status">
            <span className="status-dot"></span>
            Profile Active
          </div>
        </div>

        {loading && (
          <div className="dashboard-message">
            Loading your dashboard...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-message dashboard-message-error">
            {error}
          </div>
        )}

        {!loading && dashboard && (
          <>
            <div className="score-cards">
              <ScoreCard title="ATS Score" score={dashboard.scores.ats} />
              <ScoreCard
                title="Skill Match"
                score={dashboard.scores.skillMatch}
              />
              <ScoreCard
                title="Placement Readiness"
                score={dashboard.scores.readiness}
              />
            </div>

            <ResumeCard
              resume={dashboard.resume}
              onView={() => navigate(PATHS.resume)}
            />

            <div className="analysis-grid">
              <SkillGap
                data={dashboard.skillGap}
                onView={() => navigate(PATHS.skillGap)}
              />
              <LearningRoadmap
                data={dashboard.roadmap}
                onView={() => navigate(PATHS.roadmap)}
              />
            </div>

            <div className="bottom-grid">
              <InterviewCard
                stats={dashboard.interviews}
                onStart={() => navigate(PATHS.interview)}
              />
              <ReadinessCard
                data={dashboard.readiness}
                onView={() => navigate(PATHS.readiness)}
              />
              <MlPredictionSummary
                onView={() => navigate(PATHS.mlPrediction)}
              />
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default Dashboard
