# 🎯 AI Career SaaS Platform - Features Documentation

## 9 Premium Features

### 1. ATS Resume Score
- Endpoint: `POST /api/features/ats-score`
- Input: Resume text
- Output: Score (0-100), keywords, suggestions

### 2. Resume Improver
- Endpoint: `POST /api/features/improve-resume`
- Input: Resume text
- Output: Enhanced resume

### 3. Recruiter Evaluation
- Endpoint: `POST /api/features/recruiter-eval`
- Input: Resume + job title
- Output: Shortlist decision + reasoning

### 4. Interview Simulator
- Endpoint: `POST /api/features/interview`
- Input: Resume + job title
- Output: Practice questions

### 5. Career Predictor
- Endpoint: `POST /api/features/career-predictor`
- Input: Resume + skills
- Output: Next role + learning path

### 6. Skill Roadmap
- Endpoint: `POST /api/features/skill-roadmap`
- Input: Current skills + target
- Output: Step-by-step roadmap

### 7. Hidden Skills
- Endpoint: `POST /api/features/hidden-skills`
- Input: Resume text
- Output: Implied keywords

### 8. Company Optimizer
- Endpoint: `POST /api/features/company-optimizer`
- Input: Resume + company name
- Output: Optimized version

### 9. Personal Brand
- Endpoint: `POST /api/features/personal-brand`
- Input: Resume + name
- Output: LinkedIn headline + bio + pitch
