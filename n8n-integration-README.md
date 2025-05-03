# Portfolio n8n Integration

This document explains how to integrate the n8n workflow with your portfolio project to enable job board integration and intelligent content generation.

## Overview

The provided n8n workflow (`portfolio-job-integration.json`) implements the following features:

1. **Job Board Integration**
   - Monitors job postings from multiple sources (LinkedIn, GitHub Jobs, RemoteOK)
   - Matches job requirements with your portfolio skills
   - Tracks relevant job opportunities
   - Customizes portfolio emphasis based on specific job requirements

2. **Intelligent Content Generation**
   - Generates project case studies from your existing projects
   - Creates skill summaries based on job requirements
   - Produces tailored resumes highlighting relevant experience for specific jobs

## Prerequisites

1. **n8n Installation**
   - Install n8n: `npm install n8n -g` or use Docker
   - Start n8n: `n8n start` or `docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n`

2. **API Endpoints in Your Portfolio**
   - Your portfolio backend needs to implement several API endpoints to receive data from n8n

3. **API Credentials**
   - LinkedIn API credentials (for job search)
   - GitHub API credentials (for job search)

## Required API Endpoints

Add the following API endpoints to your portfolio backend:

### 1. Job Management Endpoints

```javascript
// backend/routes/jobs.js
import express from 'express';
import Job from '../models/Job.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ matchScore: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs
// @desc    Save jobs from n8n
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { jobs } = req.body;
    
    // Clear old jobs or update existing ones
    // This is a simple implementation - you might want to be more sophisticated
    await Job.deleteMany({});
    
    // Insert new jobs
    const savedJobs = await Job.insertMany(jobs);
    
    res.json(savedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
```

### 2. Resume Generation Endpoints

```javascript
// backend/routes/resumes.js
import express from 'express';
import TailoredResume from '../models/TailoredResume.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/resumes
// @desc    Get all tailored resumes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await TailoredResume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resumes
// @desc    Save tailored resume from n8n
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { resume } = req.body;
    
    // Check if resume for this job already exists
    let existingResume = await TailoredResume.findOne({ jobId: resume.jobId });
    
    if (existingResume) {
      // Update existing resume
      existingResume = await TailoredResume.findOneAndUpdate(
        { jobId: resume.jobId },
        resume,
        { new: true }
      );
      res.json(existingResume);
    } else {
      // Create new resume
      const newResume = new TailoredResume(resume);
      const savedResume = await newResume.save();
      res.json(savedResume);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
```

### 3. Case Studies Endpoints

```javascript
// backend/routes/caseStudies.js
import express from 'express';
import CaseStudy from '../models/CaseStudy.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/case-studies
// @desc    Get all case studies
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    res.json(caseStudies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/case-studies
// @desc    Save case study from n8n
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { caseStudy } = req.body;
    
    // Check if case study for this project and job already exists
    let existingCaseStudy = await CaseStudy.findOne({ 
      projectId: caseStudy.projectId,
      jobTitle: caseStudy.jobTitle,
      company: caseStudy.company
    });
    
    if (existingCaseStudy) {
      // Update existing case study
      existingCaseStudy = await CaseStudy.findOneAndUpdate(
        { 
          projectId: caseStudy.projectId,
          jobTitle: caseStudy.jobTitle,
          company: caseStudy.company
        },
        caseStudy,
        { new: true }
      );
      res.json(existingCaseStudy);
    } else {
      // Create new case study
      const newCaseStudy = new CaseStudy(caseStudy);
      const savedCaseStudy = await newCaseStudy.save();
      res.json(savedCaseStudy);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
```

### 4. Portfolio Emphasis Update Endpoint

```javascript
// backend/routes/portfolio.js
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/portfolio/update-emphasis
// @desc    Update portfolio emphasis based on job requirements
// @access  Private
router.post('/update-emphasis', protect, async (req, res) => {
  try {
    const { jobId, emphasizedSkills } = req.body;
    
    // Store the current emphasis in the database or session
    // This is a placeholder - implement according to your portfolio's architecture
    
    // You could update a setting in your database
    // await Setting.findOneAndUpdate(
    //   { name: 'portfolioEmphasis' },
    //   { value: { jobId, emphasizedSkills } },
    //   { upsert: true, new: true }
    // );
    
    res.json({ success: true, message: 'Portfolio emphasis updated', emphasizedSkills });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
```

### 5. Skill Summaries Endpoint

```javascript
// backend/routes/skillSummaries.js
import express from 'express';
import SkillSummary from '../models/SkillSummary.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/skill-summaries
// @desc    Get all skill summaries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const summaries = await SkillSummary.find().sort({ createdAt: -1 });
    res.json(summaries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/skill-summaries
// @desc    Generate skill summaries based on job requirements
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, jobTitle, company, skills } = req.body;
    
    // Generate summaries for each skill
    const summaries = [];
    
    for (const skill of skills) {
      // Create a summary for this skill in the context of the job
      const summary = {
        jobId,
        jobTitle,
        company,
        skillName: skill.name,
        skillLevel: skill.level,
        skillCategory: skill.category,
        summary: generateSkillSummary(skill, jobTitle, company),
        relevance: 'high' // You could calculate this based on job description
      };
      
      summaries.push(summary);
    }
    
    // Save all summaries
    const savedSummaries = await SkillSummary.insertMany(summaries);
    
    res.json(savedSummaries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to generate skill summary
function generateSkillSummary(skill, jobTitle, company) {
  return `My experience with ${skill.name} is directly relevant to the ${jobTitle} position at ${company}. I have used ${skill.name} in multiple projects, developing a strong proficiency that would be valuable in this role.`;
}

export default router;
```

## MongoDB Models

Create the following MongoDB models:

### 1. Job Model

```javascript
// backend/models/Job.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  url: {
    type: String
  },
  skills: {
    type: [String]
  },
  source: {
    type: String
  },
  matchScore: {
    type: Number,
    default: 0
  },
  matchedSkills: {
    type: Array
  },
  matchPercentage: {
    type: Number,
    default: 0
  },
  applied: {
    type: Boolean,
    default: false
  },
  applicationDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['new', 'applied', 'interviewing', 'offered', 'rejected', 'accepted'],
    default: 'new'
  }
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);
```

### 2. Tailored Resume Model

```javascript
// backend/models/TailoredResume.js
import mongoose from 'mongoose';

const TailoredResumeSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  tailoredResume: {
    summary: String,
    skills: [String],
    projects: [{
      title: String,
      description: String,
      relevanceScore: Number
    }],
    experience: [{
      title: String,
      company: String,
      period: String,
      description: String,
      relevanceScore: Number
    }]
  },
  matchPercentage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('TailoredResume', TailoredResumeSchema);
```

### 3. Case Study Model

```javascript
// backend/models/CaseStudy.js
import mongoose from 'mongoose';

const CaseStudySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  relevancePercentage: {
    type: Number,
    default: 0
  },
  caseStudy: {
    introduction: String,
    challenge: String,
    approach: String,
    solution: String,
    results: String,
    relevantSkills: String
  }
}, { timestamps: true });

// Compound index to ensure uniqueness for project + job combination
CaseStudySchema.index({ projectId: 1, jobTitle: 1, company: 1 }, { unique: true });

export default mongoose.model('CaseStudy', CaseStudySchema);
```

### 4. Skill Summary Model

```javascript
// backend/models/SkillSummary.js
import mongoose from 'mongoose';

const SkillSummarySchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  skillLevel: {
    type: Number
  },
  skillCategory: {
    type: String
  },
  summary: {
    type: String,
    required: true
  },
  relevance: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, { timestamps: true });

// Compound index to ensure uniqueness for job + skill combination
SkillSummarySchema.index({ jobId: 1, skillName: 1 }, { unique: true });

export default mongoose.model('SkillSummary', SkillSummarySchema);
```

## Setting Up the n8n Workflow

1. **Import the Workflow**
   - Open n8n in your browser (http://localhost:5678)
   - Go to Workflows > Import from File
   - Select the `portfolio-job-integration.json` file

2. **Configure Credentials**
   - Set up LinkedIn API credentials
   - Set up GitHub API credentials

3. **Set Environment Variables**
   - In n8n, go to Settings > Environment Variables
   - Add `PORTFOLIO_API_URL` with the URL of your portfolio backend (e.g., `http://localhost:5000`)

4. **Activate the Workflow**
   - Click "Activate" in the top-right corner

## Frontend Integration

Add these components to your portfolio frontend to display the generated content:

### 1. Job Matches Component

```jsx
// src/components/admin/JobMatches.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../../services/authService';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  matchScore: number;
  matchPercentage: number;
  matchedSkills: Array<{name: string, level: number, category: string}>;
  status: string;
}

const JobMatches: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/jobs`, getAuthHeader());
        setJobs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job matches');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading job matches...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="job-matches">
      <h2>Job Matches</h2>
      
      {jobs.length === 0 ? (
        <p>No job matches found.</p>
      ) : (
        <div className="job-list">
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <h4>{job.company}</h4>
              <p>{job.location}</p>
              
              <div className="match-score">
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{width: `${job.matchPercentage}%`}}
                  ></div>
                </div>
                <span>{job.matchPercentage}% Match</span>
              </div>
              
              <div className="matched-skills">
                <h5>Matched Skills:</h5>
                <div className="skill-tags">
                  {job.matchedSkills.map(skill => (
                    <span key={skill.name} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="job-actions">
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  View Job
                </a>
                <button className="btn btn-secondary">
                  View Tailored Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatches;
```

### 2. Tailored Resume Component

```jsx
// src/components/admin/TailoredResume.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from '../../services/authService';

const API_URL = import.meta.env.VITE_API_URL || '';

interface ResumeSection {
  summary: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    relevanceScore: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
    relevanceScore: number;
  }>;
}

interface TailoredResumeData {
  _id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  tailoredResume: ResumeSection;
  matchPercentage: number;
}

const TailoredResumePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [resume, setResume] = useState<TailoredResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/resumes/${jobId}`, getAuthHeader());
        setResume(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tailored resume:', err);
        setError('Failed to load tailored resume');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchResume();
    }
  }, [jobId]);

  if (loading) return <div>Loading tailored resume...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!resume) return <div>No resume found for this job.</div>;

  return (
    <div className="tailored-resume">
      <div className="resume-header">
        <h1>Tailored Resume</h1>
        <h2>For {resume.jobTitle} at {resume.company}</h2>
        <div className="match-percentage">
          {resume.matchPercentage}% Match
        </div>
      </div>

      <div className="resume-section">
        <h3>Professional Summary</h3>
        <p>{resume.tailoredResume.summary}</p>
      </div>

      <div className="resume-section">
        <h3>Skills</h3>
        <ul className="skills-list">
          {resume.tailoredResume.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="resume-section">
        <h3>Relevant Projects</h3>
        {resume.tailoredResume.projects.map((project, index) => (
          <div key={index} className="project-item">
            <h4>{project.title}</h4>
            <p>{project.description}</p>
          </div>
        ))}
      </div>

      <div className="resume-section">
        <h3>Professional Experience</h3>
        {resume.tailoredResume.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <h4>{exp.title}</h4>
            <h5>{exp.company} | {exp.period}</h5>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="resume-actions">
        <button className="btn btn-primary">Download PDF</button>
        <button className="btn btn-secondary">Edit Resume</button>
      </div>
    </div>
  );
};

export default TailoredResumePage;
```

### 3. Case Studies Component

```jsx
// src/components/admin/CaseStudies.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../../services/authService';

const API_URL = import.meta.env.VITE_API_URL || '';

interface CaseStudy {
  _id: string;
  projectId: string;
  projectTitle: string;
  jobTitle: string;
  company: string;
  relevancePercentage: number;
  caseStudy: {
    introduction: string;
    challenge: string;
    approach: string;
    solution: string;
    results: string;
    relevantSkills: string;
  };
}

const CaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/case-studies`, getAuthHeader());
        setCaseStudies(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError('Failed to load case studies');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  if (loading) return <div>Loading case studies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="case-studies">
      <h2>Project Case Studies</h2>
      
      {caseStudies.length === 0 ? (
        <p>No case studies found.</p>
      ) : (
        <div className="case-study-list">
          {caseStudies.map(study => (
            <div key={study._id} className="case-study-card">
              <div className="case-study-header">
                <h3>{study.projectTitle}</h3>
                <div className="case-study-meta">
                  <span>For {study.jobTitle} at {study.company}</span>
                  <span className="relevance">{study.relevancePercentage}% Relevant</span>
                </div>
              </div>
              
              <div className="case-study-content">
                <div className="case-study-section">
                  <h4>Introduction</h4>
                  <p>{study.caseStudy.introduction}</p>
                </div>
                
                <div className="case-study-section">
                  <h4>Challenge</h4>
                  <p>{study.caseStudy.challenge}</p>
                </div>
                
                <div className="case-study-section">
                  <h4>Approach</h4>
                  <p>{study.caseStudy.approach}</p>
                </div>
                
                <div className="case-study-section">
                  <h4>Solution</h4>
                  <p>{study.caseStudy.solution}</p>
                </div>
                
                <div className="case-study-section">
                  <h4>Results</h4>
                  <p>{study.caseStudy.results}</p>
                </div>
                
                <div className="case-study-section">
                  <h4>Relevant Skills</h4>
                  <p>{study.caseStudy.relevantSkills}</p>
                </div>
              </div>
              
              <div className="case-study-actions">
                <button className="btn btn-primary">Use This Case Study</button>
                <button className="btn btn-secondary">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseStudies;
```

## Conclusion

This n8n workflow automates the process of finding relevant job opportunities and generating tailored content for your portfolio. By implementing the required API endpoints and frontend components, you can create a dynamic portfolio that adapts to specific job requirements, helping you stand out to potential employers.

The workflow runs on a schedule, but you can also trigger it manually whenever you want to refresh the job matches and generated content.

## Next Steps

1. Implement the API endpoints in your portfolio backend
2. Create the MongoDB models
3. Add the frontend components to your portfolio
4. Import and configure the n8n workflow
5. Test the integration to ensure everything works correctly

With this setup, your portfolio will automatically adapt to highlight your most relevant skills and projects for specific job opportunities, giving you a competitive edge in your job search.
