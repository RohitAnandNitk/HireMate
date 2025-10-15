import json
import os

def get_all_problems():
    path = os.path.join(os.path.dirname(__file__), "../Utils/problems.json")
    with open(path, "r") as f:
        data = json.load(f)
        return data.get("problems", [])  # extract the list

def get_problem_by_id(pid):
    path = os.path.join(os.path.dirname(__file__), "../Utils/problems.json")
    with open(path, "r") as f:
        data = json.load(f)
        problems = data.get("problems", [])
        for p in problems:
            if str(p.get("id")) == str(pid):
                return p
    return None
