import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ResumeAnalysis() {
  const [resume, setResume] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setResume(selectedFile)
    }
  }



async function handleAnalyze() {
  if (!resume) return

  const token = localStorage.getItem('token')

  if (!token) {
    setError('Please log in before analyzing your resume.')
    return
  }

  setIsAnalyzing(true)
  setError('')

  try {
    const formData = new FormData()
    formData.append('resume', resume)

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/ai/analyze-upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    sessionStorage.setItem(
      'resumeAnalysis',
      JSON.stringify(response.data.analysis)
    )

    sessionStorage.setItem(
      'atsResult',
      JSON.stringify(response.data.ats)
    )

    navigate('/resume-results')
  } catch (err) {
    setError(
      err.response?.data?.message ||
      'Resume analysis failed. Please try again.'
    )
  } finally {
    setIsAnalyzing(false)
  }
}

  return (
    <div className="resume-page">

      {/* Page Header */}

      <div className="page-header">
        <span className="card-eyebrow">
          RESUME INTELLIGENCE
        </span>

        <h1>Resume Analysis</h1>

        <p>
          Upload your resume and let IntelliCore evaluate its quality,
          ATS compatibility and skill alignment.
        </p>
      </div>


      {/* Upload Card */}

      <div className="resume-upload-card">

        <div className="resume-upload-icon">
          ↑
        </div>

        <h2>Upload Your Resume</h2>

        <p className="upload-description">
          Upload your latest resume in PDF format to begin your analysis.
        </p>


        {/* File Upload */}

        <label className="file-upload-area">

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

          <span className="upload-button">
            Choose PDF
          </span>

          <span className="upload-hint">
            or select a file from your computer
          </span>

        </label>


        {/* Selected File */}

        {resume && (
          <div className="selected-resume">

            <div className="selected-resume-icon">
              PDF
            </div>

            <div className="selected-resume-info">
              <strong>{resume.name}</strong>

              <span>
                Ready for analysis
              </span>
            </div>

            <span className="selected-resume-check">
              ✓
            </span>

          </div>
        )}


        {/* File Information */}

        <div className="upload-meta">
          <span>PDF only</span>
          <span>•</span>
          <span>Maximum 5 MB</span>
          <span>•</span>
          <span>Secure processing</span>
        </div>


        {/* Analyze Button */}

        <button
          className="analyze-resume-button"
          onClick={handleAnalyze}
          disabled={!resume || isAnalyzing}
        >
          {isAnalyzing
            ? 'Analyzing Resume...'
            : 'Analyze Resume →'}
        </button>
        {error && <p role="alert">{error}</p>}


        {/* Loading */}

        {isAnalyzing && (
          <div className="resume-analysis-loading">

            <div className="loading-spinner"></div>

            <div>
              <strong>
                Analyzing your resume
              </strong>

              <span>
                Checking resume quality, ATS compatibility and skills...
              </span>
            </div>

          </div>
        )}

      </div>


      {/* Analysis Features */}

      <div className="analysis-features">

        <div className="analysis-feature">

          <div className="feature-icon">
            ✓
          </div>

          <div>
            <strong>Resume Quality</strong>

            <span>
              Content and structure analysis
            </span>
          </div>

        </div>


        <div className="analysis-feature">

          <div className="feature-icon">
            A
          </div>

          <div>
            <strong>ATS Compatibility</strong>

            <span>
              Check applicant tracking compatibility
            </span>
          </div>

        </div>


        <div className="analysis-feature">

          <div className="feature-icon">
            ↗
          </div>

          <div>
            <strong>Skill Alignment</strong>

            <span>
              Identify skills relevant to your target role
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ResumeAnalysis
