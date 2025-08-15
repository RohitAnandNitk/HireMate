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
```

# 📧 Emailing Agent

The **Emailing Agent** is an automated email notification system that sends personalized updates to candidates based on their shortlisting status.  
It integrates seamlessly with the **Resume Intake Agent** to inform applicants whether they have been shortlisted for the next stage.

---

## 🚀 Features
- **Automated Email Sending** – Sends notifications without manual intervention.
- **Dynamic Personalization** – Inserts candidate names and company details into email templates.
- **Separate Templates** – Maintains distinct professional messages for shortlisted and not shortlisted candidates.
- **Secure Credentials** – Uses environment variables to store SMTP server details and passwords.
- **Integration Ready** – Works directly with Resume Intake Agent’s JSON output.

---

## 🔍 How It Works

### 1️⃣ Input
- **Shortlisted List** – Array of candidate objects with `name` and `email`.
- **Not Shortlisted List** – Array of candidate objects with `name` and `email`.
- **Email Templates** – Predefined messages with placeholders for personalization.

### 2️⃣ Email Sending Process
- Reads SMTP configuration from environment variables (`SMTP_SERVER`, `SMTP_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`).
- Selects the appropriate template (`shortlisted` or `not_shortlisted`).
- Replaces placeholders like `{name}` and `{company_name}` with real data.
- Sends the email using **TLS-secured SMTP connection**.

### 3️⃣ Example Flow
1. **Resume Intake Agent** produces two lists: `shortlisted` and `not_shortlisted`.
2. **Emailing Agent** loops through each list:
   - Sends a **congratulatory email** to shortlisted candidates.
   - Sends a **polite rejection email** to not shortlisted candidates.

---

## 🛠 Environment Variables

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_generated_app_password
