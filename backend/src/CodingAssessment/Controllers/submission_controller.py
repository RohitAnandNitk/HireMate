from src.CodingAssessment.Utils.judge0_client import submit_and_wait
from src.CodingAssessment.Controllers.problem_controller import get_problem_by_id

def run_submission(code: str, language_id: int = 71, problem_id: int = None, custom_input: str = None):
    """
    code: source code string
    language_id: Judge0 language id (int)
    problem_id: optional problem id to pick test cases
    custom_input: optional custom input (string)
    """
    # Choose input: if custom provided, use it; if problem_id provided, use its default_input; else empty
    stdin = ""
    test_cases = None

    if custom_input is not None and custom_input != "":
        stdin = custom_input
    elif problem_id:
        prob = get_problem_by_id(problem_id)
        if prob:
            stdin = prob.get("default_input", "")
            test_cases = prob.get("test_cases", None)

    # If problem has multiple test cases and you want to run each, either:
    #  - create multiple judge0 submissions (one per test) and gather results
    #  - or run only default_input / custom_input via a single submission
    # Here we'll:
    #  - if test_cases present, run code against each test case and return results array
    #  - otherwise run once with stdin
    if test_cases:
        results = []
        for tc in test_cases:
            tc_input = tc.get("input", "")
            submission = submit_and_wait(source_code=code, language_id=language_id, stdin=tc_input)
            # attach expected output
            submission["expected"] = tc.get("output")
            results.append(submission)
        return {"results": results}
    else:
        submission = submit_and_wait(source_code=code, language_id=language_id, stdin=stdin)
        return submission
