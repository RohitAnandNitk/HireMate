## Resume Intake Agent

The Resume Intake Agent is an AI-powered tool designed to automatically evaluate candidate resumes against a specific job role and skill requirements. It leverages natural language understanding to go beyond simple keyword matching, recognizing synonyms, related technologies, and transferable skills.

### 🔍 How It Works

#### 1. Input:

    Job Role & Required Skills (keywords)

    Candidate’s Resume Text

#### 2. Evaluation Criteria:

    Matches core role-specific skills and relevant work experience (even if worded differently).

    Recognizes abbreviations, alternative names, and related frameworks/tools.

    Gives more weight to core skills and practical experience over exact keyword matches.

    Considers potential to learn if experience is similar but not exact.

    Checks that the resume contains at least 2 distinct projects (e.g., under headings like Projects, Academic Projects, or Personal Projects).

#### 3. Scoring & Decision:

    Assigns a match score between 0 and 100.

    Outputs "yes" if:

    The score is 75 or above, and

    At least 2 projects are listed.

    Otherwise, outputs "no".

#### Output:

    Only "yes" or "no" — no explanations, no extra text.