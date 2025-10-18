from datetime import datetime
from enum import Enum

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

class SubmissionResult(str, Enum):
    ACCEPTED = "Accepted"
    WRONG_ANSWER = "Wrong Answer"
    RUNTIME_ERROR = "Runtime Error"
    COMPILATION_ERROR = "Compilation Error"
    TIME_LIMIT_EXCEEDED = "Time Limit Exceeded"
    MEMORY_LIMIT_EXCEEDED = "Memory Limit Exceeded"
    ERROR = "Error"

class ProgrammingLanguage(str, Enum):
    PYTHON = "python"
    CPP = "cpp"
    JAVA = "java"
    JAVASCRIPT = "javascript"
    C = "c"


def create_question_submission(
    question_id,
    question_number,
    source_code,
    language,
    total_test_cases,
    time_taken=0,
    test_cases_passed=0,
    status=SubmissionStatus.PENDING,
    result=None,
    error_message=None,
    execution_time=None,
    memory_used=None
):
    """
    Create a submission object for an individual question.
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
    candidate_id,
    drive_id,
    code_assessment_id,
    total_questions,
    question_submissions=None,
    questions_solved=0,
    total_time_taken=0,
    status=SubmissionStatus.PENDING,
    submitted_at=None
):
    """
    Create a submission document for a code assessment.
    
    Args:
        candidate_id: ID of the candidate (required)
        drive_id: ID of the drive (required)
        code_assessment_id: ID of the code assessment (required)
        total_questions: Total number of questions in assessment (required)
        question_submissions: List of question submission objects (default: [])
        questions_solved: Number of questions successfully solved (default: 0)
        total_time_taken: Total time taken in seconds (default: 0)
        status: Overall submission status (default: PENDING)
        submitted_at: Submission completion timestamp (default: None)
    
    Returns:
        dict: Submission document
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
        "candidate_id": candidate_id,
        "drive_id": drive_id,
        "code_assessment_id": code_assessment_id,
        "total_questions": total_questions,
        "questions_solved": questions_solved,
        "score_percentage": round(score_percentage, 2),
        "total_time_taken": total_time_taken,
        "question_submissions": question_submissions or [],
        "status": status,
        "started_at": datetime.utcnow(),
        "submitted_at": submitted_at,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    return submission_data


def update_submission_status(
    status,
    questions_solved=None,
    score_percentage=None,
    submitted_at=None
):
    """
    Create update fields for submission status.
    
    Args:
        status: New status (required)
        questions_solved: Updated count of solved questions (optional)
        score_percentage: Updated score percentage (optional)
        submitted_at: Submission completion timestamp (optional)
    
    Returns:
        dict: Update fields
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
    status,
    result,
    test_cases_passed,
    total_test_cases,
    execution_time=None,
    memory_used=None,
    error_message=None
):
    """
    Create update fields for a specific question submission result.
    
    Args:
        status: Execution status (required)
        result: Result of the submission (required)
        test_cases_passed: Number of test cases passed (required)
        total_test_cases: Total test cases (required)
        execution_time: Execution time in milliseconds (optional)
        memory_used: Memory used in MB (optional)
        error_message: Error message if any (optional)
    
    Returns:
        dict: Update fields for MongoDB array update
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


def determine_submission_result(judge0_status, expected_output=None, actual_output=None):
    """
    Determine the submission result based on Judge0 status and output comparison.
    
    Args:
        judge0_status: Status object from Judge0
        expected_output: Expected output string (optional)
        actual_output: Actual output string (optional)
    
    Returns:
        SubmissionResult enum value
    """
    status_id = judge0_status.get("id")
    
    # Judge0 status IDs:
    # 3 = Accepted
    # 4 = Wrong Answer
    # 5 = Time Limit Exceeded
    # 6 = Compilation Error
    # 7-12 = Runtime Errors
    # 13 = Internal Error
    # 14 = Exec Format Error
    
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
    """
    language_map = {
        "python": 71,     # Python 3
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


def calculate_submission_statistics(question_submissions):
    """
    Calculate statistics from question submissions.
    
    Args:
        question_submissions: List of question submission objects
    
    Returns:
        dict: Statistics including solved count, total time, etc.
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


def validate_submission_data(submission_data):
    """
    Validate submission data before saving to database.
    
    Args:
        submission_data: Submission document to validate
    
    Returns:
        tuple: (is_valid, error_message)
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


def format_submission_response(submission_doc):
    """
    Format submission document for API response.
    
    Args:
        submission_doc: Submission document from database
    
    Returns:
        dict: Formatted submission data
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