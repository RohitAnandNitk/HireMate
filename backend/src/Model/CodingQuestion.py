from datetime import datetime
from enum import Enum

class QuestionDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


def create_coding_question(
    title,
    description,
    test_cases,
    constraints="",
    difficulty=QuestionDifficulty.MEDIUM,
    tags=None,
    time_limit=None,
    memory_limit=None,
    company_id=None
):
    """
    Create a coding question document.
    """
    # Validate test cases
    if not test_cases or len(test_cases) == 0:
        raise ValueError("At least one test case is required")
    
    for i, test_case in enumerate(test_cases):
        if "input" not in test_case or "output" not in test_case:
            raise ValueError(f"Test case {i+1} must have both 'input' and 'output' fields")
        if not str(test_case["input"]).strip() or not str(test_case["output"]).strip():
            raise ValueError(f"Test case {i+1} input and output cannot be empty")
    
    # Validate difficulty
    if difficulty not in QuestionDifficulty._value2member_map_:
        raise ValueError(f"Invalid difficulty '{difficulty}'. Must be one of: {list(QuestionDifficulty._value2member_map_.keys())}")
    
    # Validate title and description
    if not title or not str(title).strip():
        raise ValueError("Title is required")
    if not description or not str(description).strip():
        raise ValueError("Description is required")

    question_data = {
        "title": str(title).strip(),
        "description": str(description).strip(),
        "constraints": str(constraints).strip() if constraints else "",
        "difficulty": difficulty,
        "tags": tags or [],
        "test_cases": test_cases,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    # Add optional fields
    if time_limit is not None:
        if not isinstance(time_limit, int) or time_limit < 1:
            raise ValueError("time_limit must be a positive integer")
        question_data["time_limit"] = time_limit
    
    if memory_limit is not None:
        if not isinstance(memory_limit, int) or memory_limit < 1:
            raise ValueError("memory_limit must be a positive integer")
        question_data["memory_limit"] = memory_limit
    
    if company_id:
        question_data["company_id"] = company_id

    return question_data