from flask import Blueprint, jsonify
from src.CodingAssessment.Controllers.problem_controller import get_all_problems, get_problem_by_id

problem_bp = Blueprint("problem", __name__)

@problem_bp.route("/", methods=["GET"])
def problems():
    return jsonify(get_all_problems())

@problem_bp.route("/<problem_id>", methods=["GET"])
def problem(problem_id):
    p = get_problem_by_id(problem_id)
    if p:
        return jsonify(p)
    else:
        return jsonify({"error": "Problem not found"}), 404
