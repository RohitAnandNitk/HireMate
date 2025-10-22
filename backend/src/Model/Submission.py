from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any

class SubmissionStatus(str, Enum):
    """Overall submission status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class SubmissionResult(str, Enum):
    """Result of code execution"""
    ACCEPTED = "Accepted"
    WRONG_ANSWER = "Wrong Answer"
    RUNTIME_ERROR = "Runtime Error"
    COMPILATION_ERROR = "Compilation Error"
    TIME_LIMIT_EXCEEDED = "Time Limit Exceeded"
    MEMORY_LIMIT_EXCEEDED = "Memory Limit Exceeded"
    ERROR = "Error"

class ProgrammingLanguage(str, Enum):
    """Supported programming languages"""
    PYTHON = "python"
    CPP = "cpp"
    JAVA = "java"
    JAVASCRIPT = "javascript"
    C = "c"


def create_question_submission(
    question_id: str,
    question_number: int,
    source_code: str,
    language: str,
    total_test_cases: int,
    time_taken: int = 0,
    test_cases_passed: int = 0,
    status: str = SubmissionStatus.PENDING,
    result: Optional[str] = None,
    error_message: Optional[str] = None,
    execution_time: Optional[int] = None,
    memory_used: Optional[float] = None
) -> Dict[str, Any]:
    """
    Create a submission object for an individual question.
    
    Args:
        question_id: MongoDB ObjectId of the coding question
        question_number: Sequential number (1, 2, 3, ...)
        source_code: User's submitted code
        language: Programming language (python, cpp, java, javascript, c)
        total_test_cases: Total number of test cases for this question
        time_taken: Time spent on this question in seconds (default: 0)
        test_cases_passed: Number of test cases that passed (default: 0)
        status: Execution status (default: PENDING)
        result: Overall result (Accepted, Wrong Answer, etc.)
        error_message: Error message if any
        execution_time: Total execution time in milliseconds
        memory_used: Peak memory usage in MB
    
    Returns:
        dict: Question submission document
    
    Raises:
        ValueError: If validation fails
    """
    # Validate language
    if language not in ProgrammingLanguage._value2member_map_:
        raise ValueError(
            f"Invalid language '{language}'. Must be one of: {list(ProgrammingLanguage._value2member_map_.keys())}"
        )
    
    # Validate status
    if status not in SubmissionStatus._value2member_map_:
        raise ValueError(
            f"Invalid status '{status}'. Must be one of: {list(SubmissionStatus._value2member_map_.keys())}"
        )
    
    # Validate result if provided
    if result and result not in SubmissionResult._value2member_map_:
        raise ValueError(
            f"Invalid result '{result}'. Must be one of: {list(SubmissionResult._value2member_map_.keys())}"
        )
    
    # Validate source code
    if not source_code or not source_code.strip():
        raise ValueError("source_code cannot be empty")
    
    # Validate test cases
    if test_cases_passed < 0 or test_cases_passed > total_test_cases:
        raise ValueError(f"test_cases_passed must be between 0 and {total_test_cases}")
    
    return {
        "question_id": question_id,
        "question_number": question_number,
        "source_code": source_code,
        "language": language,
        "time_taken": time_taken,  # in seconds
        "test_cases_passed": test_cases_passed,
        "total_test_cases": total_test_cases,
        "status": status,
        "result": result,
        "error_message": error_message,
        "execution_time": execution_time,  # in milliseconds
        "memory_used": memory_used,  # in MB
        "submitted_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }


def create_submission(
    candidate_id: str,
    drive_id: str,
    code_assessment_id: str,
    total_questions: int,
    question_submissions: Optional[List[Dict]] = None,
    questions_solved: int = 0,
    total_time_taken: int = 0,
    status: str = SubmissionStatus.PENDING,
    submitted_at: Optional[datetime] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a submission document for a code assessment.
    
    This creates the main submission record that tracks a candidate's entire
    assessment attempt for a specific drive.
    
    Args:
        candidate_id: ID of the candidate (required)
        drive_id: MongoDB ObjectId of the drive (required)
        code_assessment_id: Same as drive_id (required for consistency)
        total_questions: Total number of questions in assessment (required)
        question_submissions: List of question submission objects (default: [])
        questions_solved: Number of questions with result="Accepted" (default: 0)
        total_time_taken: Total time taken in seconds (default: 0)
        status: Overall submission status (default: PENDING)
        submitted_at: When user clicked "Submit Assessment" (default: None)
        ip_address: User's IP address (optional)
        user_agent: Browser user agent (optional)
    
    Returns:
        dict: Submission document ready to insert into MongoDB
    
    Raises:
        ValueError: If validation fails
    
    Example:
        >>> submission = create_submission(
        ...     candidate_id="candidate_12345",
        ...     drive_id="507f1f77bcf86cd799439011",
        ...     code_assessment_id="507f1f77bcf86cd799439011",
        ...     total_questions=3
        ... )
    """
    # Validate status
    if status not in SubmissionStatus._value2member_map_:
        raise ValueError(
            f"Invalid status '{status}'. Must be one of: {list(SubmissionStatus._value2member_map_.keys())}"
        )
    
    # Validate required fields
    if not candidate_id:
        raise ValueError("candidate_id is required")
    
    if not drive_id:
        raise ValueError("drive_id is required")
    
    if not code_assessment_id:
        raise ValueError("code_assessment_id is required")
    
    if not isinstance(total_questions, int) or total_questions < 1:
        raise ValueError("total_questions must be a positive integer")
    
    # Validate questions_solved
    if questions_solved < 0 or questions_solved > total_questions:
        raise ValueError(f"questions_solved must be between 0 and {total_questions}")
    
    # Calculate score percentage
    score_percentage = (questions_solved / total_questions * 100) if total_questions > 0 else 0
    
    submission_data = {
        # Identification
        "candidate_id": candidate_id,
        "drive_id": drive_id,
        "code_assessment_id": code_assessment_id,
        
        # Assessment Overview
        "total_questions": total_questions,
        "questions_solved": questions_solved,
        "score_percentage": round(score_percentage, 2),
        "total_time_taken": total_time_taken,
        
        # Question Submissions Array
        "question_submissions": question_submissions or [],
        
        # Status & Timestamps
        "status": status,
        "started_at": datetime.utcnow(),
        "submitted_at": submitted_at,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Add optional metadata
    if ip_address:
        submission_data["ip_address"] = ip_address
    
    if user_agent:
        submission_data["user_agent"] = user_agent
    
    return submission_data


def update_submission_status(
    status: str,
    questions_solved: Optional[int] = None,
    score_percentage: Optional[float] = None,
    submitted_at: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    Create update fields for submission status.
    
    Args:
        status: New status (required)
        questions_solved: Updated count of solved questions (optional)
        score_percentage: Updated score percentage (optional)
        submitted_at: Submission completion timestamp (optional)
    
    Returns:
        dict: Update fields for MongoDB $set operation
    
    Example:
        >>> updates = update_submission_status(
        ...     status=SubmissionStatus.COMPLETED,
        ...     questions_solved=2,
        ...     score_percentage=66.67,
        ...     submitted_at=datetime.utcnow()
        ... )
        >>> db.submissions.update_one(
        ...     {"_id": submission_id},
        ...     {"$set": updates}
        ... )
    """
    if status not in SubmissionStatus._value2member_map_:
        raise ValueError(
            f"Invalid status '{status}'. Must be one of: {list(SubmissionStatus._value2member_map_.keys())}"
        )
    
    updates = {
        "status": status,
        "updated_at": datetime.utcnow()
    }
    
    if questions_solved is not None:
        updates["questions_solved"] = questions_solved
    
    if score_percentage is not None:
        updates["score_percentage"] = round(score_percentage, 2)
    
    if submitted_at:
        updates["submitted_at"] = submitted_at
    
    return updates


def update_question_submission_result(
    status: str,
    result: str,
    test_cases_passed: int,
    total_test_cases: int,
    execution_time: Optional[int] = None,
    memory_used: Optional[float] = None,
    error_message: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create update fields for a specific question submission result.
    
    This is used with MongoDB's positional $ operator to update a specific
    question in the question_submissions array.
    
    Args:
        status: Execution status (required)
        result: Result of the submission (required)
        test_cases_passed: Number of test cases passed (required)
        total_test_cases: Total test cases (required)
        execution_time: Execution time in milliseconds (optional)
        memory_used: Memory used in MB (optional)
        error_message: Error message if any (optional)
    
    Returns:
        dict: Update fields for MongoDB array update with $ operator
    
    Example:
        >>> updates = update_question_submission_result(
        ...     status=SubmissionStatus.COMPLETED,
        ...     result=SubmissionResult.ACCEPTED,
        ...     test_cases_passed=10,
        ...     total_test_cases=10
        ... )
        >>> db.submissions.update_one(
        ...     {"_id": submission_id, "question_submissions.question_id": question_id},
        ...     {"$set": updates}
        ... )
    """
    if status not in SubmissionStatus._value2member_map_:
        raise ValueError(
            f"Invalid status '{status}'. Must be one of: {list(SubmissionStatus._value2member_map_.keys())}"
        )
    
    if result not in SubmissionResult._value2member_map_:
        raise ValueError(
            f"Invalid result '{result}'. Must be one of: {list(SubmissionResult._value2member_map_.keys())}"
        )
    
    # MongoDB update query to update specific question in array
    update_fields = {
        "question_submissions.$.status": status,
        "question_submissions.$.result": result,
        "question_submissions.$.test_cases_passed": test_cases_passed,
        "question_submissions.$.total_test_cases": total_test_cases,
        "question_submissions.$.updated_at": datetime.utcnow()
    }
    
    if execution_time is not None:
        update_fields["question_submissions.$.execution_time"] = execution_time
    
    if memory_used is not None:
        update_fields["question_submissions.$.memory_used"] = memory_used
    
    if error_message:
        update_fields["question_submissions.$.error_message"] = error_message
    
    return update_fields


def determine_submission_result(
    judge0_status: Dict[str, Any],
    expected_output: Optional[str] = None,
    actual_output: Optional[str] = None
) -> str:
    """
    Determine the submission result based on Judge0 status and output comparison.
    
    Judge0 Status IDs:
        3 = Accepted
        4 = Wrong Answer
        5 = Time Limit Exceeded
        6 = Compilation Error
        7-12 = Runtime Errors
        13 = Internal Error
        14 = Exec Format Error
    
    Args:
        judge0_status: Status object from Judge0 API
        expected_output: Expected output string (optional)
        actual_output: Actual output string (optional)
    
    Returns:
        SubmissionResult enum value as string
    
    Example:
        >>> result = determine_submission_result(
        ...     judge0_status={"id": 3, "description": "Accepted"},
        ...     expected_output="42",
        ...     actual_output="42"
        ... )
        >>> print(result)  # "Accepted"
    """
    status_id = judge0_status.get("id")
    
    if status_id == 3:  # Accepted
        # Verify output matches if expected output is provided
        if expected_output and actual_output:
            if actual_output.strip() == expected_output.strip():
                return SubmissionResult.ACCEPTED
            else:
                return SubmissionResult.WRONG_ANSWER
        return SubmissionResult.ACCEPTED
    elif status_id == 4:
        return SubmissionResult.WRONG_ANSWER
    elif status_id == 5:
        return SubmissionResult.TIME_LIMIT_EXCEEDED
    elif status_id == 6:
        return SubmissionResult.COMPILATION_ERROR
    elif status_id in [7, 8, 9, 10, 11, 12]:
        return SubmissionResult.RUNTIME_ERROR
    else:
        return SubmissionResult.ERROR


def get_language_id(language: str) -> int:
    """
    Get Judge0 language ID from language string.
    
    Args:
        language: Programming language string
    
    Returns:
        int: Judge0 language ID
    
    Raises:
        ValueError: If language is not supported
    
    Example:
        >>> language_id = get_language_id("python")
        >>> print(language_id)  # 71
    """
    language_map = {
        "python": 71,     # Python 3.8.1
        "cpp": 54,        # C++ (GCC 9.2.0)
        "java": 62,       # Java (OpenJDK 13.0.1)
        "javascript": 63, # JavaScript (Node.js 12.14.0)
        "c": 50           # C (GCC 9.2.0)
    }
    
    language_id = language_map.get(language.lower())
    
    if not language_id:
        raise ValueError(
            f"Unsupported language: {language}. Supported languages: {list(language_map.keys())}"
        )
    
    return language_id


def calculate_submission_statistics(question_submissions: List[Dict]) -> Dict[str, Any]:
    """
    Calculate statistics from question submissions.
    
    Args:
        question_submissions: List of question submission objects
    
    Returns:
        dict: Statistics including solved count, total time, etc.
    
    Example:
        >>> stats = calculate_submission_statistics(submission["question_submissions"])
        >>> print(stats)
        {
            "total_questions": 3,
            "questions_solved": 2,
            "score_percentage": 66.67,
            "total_time_taken": 450,
            "all_completed": True
        }
    """
    total_questions = len(question_submissions)
    
    questions_solved = sum(
        1 for qs in question_submissions 
        if qs.get("result") == SubmissionResult.ACCEPTED
    )
    
    total_time_taken = sum(
        qs.get("time_taken", 0) for qs in question_submissions
    )
    
    score_percentage = (questions_solved / total_questions * 100) if total_questions > 0 else 0
    
    completed = all(
        qs.get("status") in [SubmissionStatus.COMPLETED, SubmissionStatus.ERROR]
        for qs in question_submissions
    )
    
    return {
        "total_questions": total_questions,
        "questions_solved": questions_solved,
        "score_percentage": round(score_percentage, 2),
        "total_time_taken": total_time_taken,
        "all_completed": completed
    }


def validate_submission_data(submission_data: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """
    Validate submission data before saving to database.
    
    Args:
        submission_data: Submission document to validate
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    
    Example:
        >>> is_valid, error = validate_submission_data(submission)
        >>> if not is_valid:
        ...     print(f"Validation failed: {error}")
    """
    required_fields = [
        "candidate_id",
        "drive_id",
        "code_assessment_id",
        "total_questions"
    ]
    
    for field in required_fields:
        if field not in submission_data or not submission_data[field]:
            return False, f"Missing required field: {field}"
    
    # Validate total_questions
    if not isinstance(submission_data["total_questions"], int) or submission_data["total_questions"] < 1:
        return False, "total_questions must be a positive integer"
    
    # Validate questions_solved
    questions_solved = submission_data.get("questions_solved", 0)
    total_questions = submission_data["total_questions"]
    if questions_solved < 0 or questions_solved > total_questions:
        return False, f"questions_solved must be between 0 and {total_questions}"
    
    # Validate status
    status = submission_data.get("status")
    if status and status not in SubmissionStatus._value2member_map_:
        return False, f"Invalid status: {status}"
    
    return True, None


def format_submission_response(submission_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format submission document for API response.
    
    Converts ObjectIds to strings and datetimes to ISO format strings
    for JSON serialization.
    
    Args:
        submission_doc: Submission document from database
    
    Returns:
        dict: Formatted submission data ready for JSON response
    
    Example:
        >>> submission = db.submissions.find_one({"_id": submission_id})
        >>> formatted = format_submission_response(submission)
        >>> return jsonify(formatted)
    """
    # Convert ObjectId to string if present
    if "_id" in submission_doc:
        submission_doc["_id"] = str(submission_doc["_id"])
    
    # Format timestamps
    for field in ["started_at", "submitted_at", "created_at", "updated_at"]:
        if field in submission_doc and submission_doc[field]:
            submission_doc[field] = submission_doc[field].isoformat()
    
    # Format question submissions timestamps
    for qs in submission_doc.get("question_submissions", []):
        for field in ["submitted_at", "created_at", "updated_at"]:
            if field in qs and qs[field]:
                qs[field] = qs[field].isoformat()
    
    return submission_doc


# ==========================================
# SUBMISSION SCHEMA DEFINITION
# ==========================================

SUBMISSION_SCHEMA = {
    # Identification
    "_id": "ObjectId (auto-generated by MongoDB)",
    "candidate_id": "string (required) - Candidate identifier",
    "drive_id": "ObjectId (required) - Reference to drives collection",
    "code_assessment_id": "ObjectId (required) - Same as drive_id",
    
    # Assessment Overview
    "total_questions": "int (required) - Total questions in assessment",
    "questions_solved": "int - Questions with result='Accepted'",
    "score_percentage": "float - Overall score (0-100)",
    "total_time_taken": "int - Total time in seconds",
    
    # Status & Timestamps
    "status": "string - 'pending' | 'running' | 'completed' | 'error'",
    "started_at": "datetime - When submission was created",
    "submitted_at": "datetime or None - When user clicked Submit Assessment",
    "created_at": "datetime - Record creation timestamp",
    "updated_at": "datetime - Last update timestamp",
    
    # Question Submissions Array
    "question_submissions": [
        {
            "question_id": "ObjectId - Reference to coding_questions",
            "question_number": "int - Sequential number (1, 2, 3...)",
            "source_code": "string - User's submitted code",
            "language": "string - 'python' | 'cpp' | 'java' | 'javascript' | 'c'",
            "time_taken": "int - Time spent in seconds",
            "test_cases_passed": "int - Number of passed test cases",
            "total_test_cases": "int - Total test cases",
            "status": "string - 'pending' | 'running' | 'completed' | 'error'",
            "result": "string - 'Accepted' | 'Wrong Answer' | 'Runtime Error' etc.",
            "execution_time": "int - Execution time in milliseconds",
            "memory_used": "float - Memory used in MB",
            "error_message": "string or None - Error details if any",
            "submitted_at": "datetime - When question was submitted",
            "created_at": "datetime",
            "updated_at": "datetime"
        }
    ],
    
    # Optional Metadata
    "ip_address": "string (optional) - User's IP address",
    "user_agent": "string (optional) - Browser user agent"
}


# ==========================================
# MONGODB INDEXES
# ==========================================

"""
Recommended MongoDB indexes for optimal query performance:

# Unique index for one submission per candidate per drive
db.submissions.createIndex(
    {"candidate_id": 1, "drive_id": 1},
    {unique: true}
)

# Index for getting all submissions for a drive
db.submissions.createIndex(
    {"drive_id": 1, "status": 1}
)

# Index for candidate submission history
db.submissions.createIndex(
    {"candidate_id": 1, "created_at": -1}
)

# Index for leaderboard queries
db.submissions.createIndex(
    {"drive_id": 1, "score_percentage": -1, "submitted_at": -1}
)

# Index for admin dashboard
db.submissions.createIndex(
    {"status": 1, "created_at": -1}
)
"""