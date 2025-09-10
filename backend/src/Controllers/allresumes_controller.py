from flask import jsonify
from src.Utils.Database import db  # db should be your Mongo connection instance

def get_allresumes_controller():
    try:
        # Exclude _id and resume_content
        resumes = list(db["candidates"].find({}, {"_id": 0, "resume_content": 0}))

        return jsonify({
            "success": True,
            "count": len(resumes),
            "data": resumes
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
