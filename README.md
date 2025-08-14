# 📄 Resume Intake Agent

The **Resume Intake Agent** is an AI-powered resume screening tool that automatically evaluates candidate resumes for a given job role.  
It uses natural language understanding to detect relevant skills, experience, and projects — going beyond simple keyword matching.

---

## 🚀 Features
- **Semantic Skill Matching** – Recognizes synonyms, abbreviations, related tools, and frameworks.
- **Weighted Scoring** – Prioritizes core skills and real-world experience over simple keyword hits.
- **Project Validation** – Ensures at least **2 distinct projects** are present in the resume.
- **Contact Extraction** – Retrieves candidate's **name** and **email** for notification purposes.
- **Structured Output** – Provides results in strict JSON format for easy integration.

---

## 🔍 How It Works

### 1️⃣ Input
- **Job Role & Required Skills** – Keywords or skill list for the position.
- **Candidate Resume Text** – Extracted from uploaded PDF files.

### 2️⃣ Evaluation Process
- Match **role-specific skills** and relevant experience (semantic understanding).
- Detect synonyms, abbreviations, and alternative terminology.
- Give more weight to core skills and practical experience.
- Consider similar experience for transferable skills.
- Verify that **at least 2 distinct projects** are listed (Projects, Academic Projects, or Personal Projects).

### 3️⃣ Scoring & Decision
- **Score Range:** `0–100` based on skill and experience match.
- **Shortlist Criteria:**
  - Score ≥ **75**
  - At least **2 projects**
- If both criteria are met → **Shortlisted ("yes")**
- Otherwise → **Not Shortlisted ("no")**

### 4️⃣ Output Format
Strict JSON output:
```json
{
  "shortlisted": "yes" | "no",
  "name": "<Candidate Name>",
  "email": "<Candidate Email>"
}
