
import { useState } from 'react'
import axios from 'axios'

function SkillGap() {
  const [targetRole, setTargetRole] = useState('Backend Developer')
  const [skillGap, setSkillGap] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please log in before analyzing your skills.')
      return
    }

    if (!targetRole.trim()) {
      setError('Please enter a target job role.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/skill-gap`,
        { targetRole: targetRole.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSkillGap(response.data.skillGap)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to analyze your skills. Please try again.'
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const currentSkills = skillGap?.currentSkills || []
  const requiredSkills = skillGap?.requiredSkills || []
  const missingSkills = skillGap?.missingSkills || []
  const recommendations = skillGap?.recommendations || []

  const matchScore =
    requiredSkills.length > 0
      ? Math.round(
          ((requiredSkills.length -
            missingSkills.length) /
            requiredSkills.length) *
            100
        )
      : 0

  const getSkillStatus = (skill) => {
    if (missingSkills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    )) {
      return {
        status: 'Needs Improvement',
        type: 'low',
      }
    }

    return {
      status: 'Identified',
      type: 'good',
    }
  }

  const displayedSkills = currentSkills.map((name) => ({
    name,
    ...getSkillStatus(name),
  }))

  return (
    <div className="skill-page">
      <div className="page-header">
        <span className="card-eyebrow">SKILL INTELLIGENCE</span>

        <h1>Skill Gap Analysis</h1>

        <p>
          Understand your current skills and identify the areas
          that need improvement for your target role.
        </p>
      </div>

      <div className="skill-profile-card">
        <div className="section-heading">
          <div>
            <span className="card-eyebrow">TARGET ROLE</span>
            <h2>Choose Your Career Goal</h2>
            <p>
              Enter the role you want to prepare for.
            </p>
          </div>
        </div>

        <div className="skill-role-controls">
          <label htmlFor="targetRole">Target job role</label>

          <input
            id="targetRole"
            type="text"
            value={targetRole}
            onChange={(event) =>
              setTargetRole(event.target.value)
            }
            placeholder="e.g. AI Engineer"
          />

          <button
            className="analyze-resume-button"
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !targetRole.trim()}
          >
            {isAnalyzing
              ? 'Analyzing Skills...'
              : 'Analyze My Skills →'}
          </button>
        </div>

        {error && <p role="alert">{error}</p>}
      </div>

      {isAnalyzing && (
        <div className="skill-focus-card">
          Analyzing your saved resume for the {targetRole} role...
        </div>
      )}

      {skillGap && (
        <>
          <div className="skill-summary">
            <div className="skill-summary-card">
              <span>Overall Skill Match</span>
              <strong>{matchScore}%</strong>
              <p>Estimated match with required skills</p>
            </div>

            <div className="skill-summary-card">
              <span>Skills Identified</span>
              <strong>{currentSkills.length}</strong>
              <p>Skills found in your saved resume</p>
            </div>

            <div className="skill-summary-card">
              <span>Skills to Improve</span>
              <strong>{missingSkills.length}</strong>
              <p>Skills missing for your target role</p>
            </div>
          </div>

          <div className="skill-profile-card">
            <div className="section-heading">
              <div>
                <span className="card-eyebrow">
                  YOUR SKILL PROFILE
                </span>
                <h2>Current Skills</h2>
                <p>
                  Skills identified by the analysis for {targetRole}.
                </p>
              </div>
            </div>

            {displayedSkills.length === 0 ? (
              <p>
                No current skills were identified. Check that your
                saved resume contains readable skill information.
              </p>
            ) : (
              <div className="skill-profile-list">
                {displayedSkills.map((skill) => (
                  <div
                    className="skill-profile-item"
                    key={skill.name}
                  >
                    <div className="skill-profile-info">
                      <div>
                        <strong>{skill.name}</strong>
                        <span
                          className={`skill-status ${skill.type}`}
                        >
                          {skill.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="skill-focus-card">
            <div className="section-heading">
              <div>
                <span className="card-eyebrow">
                  REQUIRED SKILLS
                </span>
                <h2>Skills for {targetRole}</h2>
              </div>
            </div>

            <div className="focus-list">
              {requiredSkills.length === 0 ? (
                <p>No required skills were returned.</p>
              ) : (
                requiredSkills.map((skill, index) => (
                  <div className="focus-item" key={skill}>
                    <div className="focus-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <strong>{skill}</strong>
                      <span>
                        {missingSkills.some(
                          (item) =>
                            item.toLowerCase() === skill.toLowerCase()
                        )
                          ? 'This skill was identified as missing.'
                          : 'This skill was not identified as missing.'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="skill-focus-card">
            <div className="section-heading">
              <div>
                <span className="card-eyebrow">
                  RECOMMENDED FOCUS
                </span>
                <h2>Areas to Improve</h2>
                <p>
                  Recommendations returned by the AI analysis.
                </p>
              </div>
            </div>

            <div className="focus-list">
              {recommendations.length === 0 &&
              missingSkills.length === 0 ? (
                <p>No improvement recommendations were returned.</p>
              ) : (
                <>
                  {missingSkills.map((skill, index) => (
                    <div className="focus-item" key={skill}>
                      <div className="focus-number">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <strong>{skill}</strong>
                        <span>
                          Focus on learning and practicing this skill.
                        </span>
                      </div>
                    </div>
                  ))}

                  {recommendations.map((recommendation, index) => (
                    <div
                      className="focus-item"
                      key={`${index}-${recommendation}`}
                    >
                      <div className="focus-number">↗</div>
                      <div>
                        <strong>{recommendation}</strong>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SkillGap
