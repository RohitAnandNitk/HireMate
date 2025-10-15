from flask import Blueprint, request, jsonify
from src.CodingAssessment.Controllers.submission_controller import run_submission

submission_bp = Blueprint("submission", __name__)

@submission_bp.post("/run")
def run_code():
    payload = request.get_json(force=True)
    if not payload or "code" not in payload:
        return jsonify({"error": "Missing 'code' in request body"}), 400

    code = payload["code"]
    language_id = payload.get("language_id", 71)  # default: Python 3 (Judge0 id may vary)
    problem_id = payload.get("problem_id")
    custom_input = payload.get("input")  # optional

    print("Code :", code)
    print("Lang :", language_id)
    print("prob :", problem_id)
    print("Cus input :", custom_input)


    result = run_submission(code=code, language_id=language_id, problem_id=problem_id, custom_input=custom_input)
    return jsonify(result)
