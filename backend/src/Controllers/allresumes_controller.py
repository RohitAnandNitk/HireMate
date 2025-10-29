from flask import jsonify, request
from src.Utils.Database import db  # db should be your Mongo connection instance
from bson import ObjectId


def get_allresumes_controller():
    try:
        # Exclude _id and resume_content
        resumes = list(db["candidates"].find({}, {"_id": 0}))

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
    


def get_drive_candidates_controller(drive_id):
    """
    Fetch all candidates for a specific drive with their full details
    """
    try:
        if not drive_id:
            return jsonify({
                "success": False,
                "error": "Drive ID is required"
            }), 400

        print(f"Fetching candidates for drive_id: {drive_id}")

        # Step 1: Get all drive_candidate records for this drive
        drive_candidates = list(db["drive_candidates"].find({
            "drive_id": drive_id
        }))

        print(f"Found {len(drive_candidates)} drive_candidate records")

        if not drive_candidates:
            return jsonify({
                "success": True,
                "count": 0,
                "candidates": [],
                "message": "No candidates found for this drive"
            }), 200

        # Step 2: Extract candidate_ids
        candidate_ids = [dc.get("candidate_id") for dc in drive_candidates if dc.get("candidate_id")]

        print(f"Extracted candidate_ids: {candidate_ids}")

        if not candidate_ids:
            return jsonify({
                "success": True,
                "count": 0,
                "candidates": [],
                "message": "No candidate IDs found"
            }), 200

        # Step 3: Fetch candidate details - try both string and ObjectId
        candidates = []
        
        # Try with string IDs first
        candidates = list(db["candidates"].find(
            {"_id": {"$in": candidate_ids}},
            {
                "_id": 1,
                "name": 1,
                "email": 1,
                "resume_url": 1,
                "created_at": 1
            }
        ))
        
        # If no results, try converting to ObjectId
        if not candidates:
            try:
                object_ids = []
                for cid in candidate_ids:
                    try:
                        object_ids.append(ObjectId(cid))
                    except:
                        continue
                
                if object_ids:
                    candidates = list(db["candidates"].find(
                        {"_id": {"$in": object_ids}},
                        {
                            "_id": 1,
                            "name": 1,
                            "email": 1,
                            "resume_url": 1,
                            "created_at": 1
                        }
                    ))
            except Exception as e:
                print(f"Error converting to ObjectId: {e}")

        print(f"Found {len(candidates)} candidate details")

        # Format the response
        formatted_candidates = []
        for candidate in candidates:
            formatted_candidates.append({
                "id": str(candidate.get("_id", "")),
                "name": candidate.get("name", "N/A"),
                "email": candidate.get("email", "N/A"),
                "resume_url": candidate.get("resume_url", ""),
                "created_at": str(candidate.get("created_at", "")) if candidate.get("created_at") else ""
            })

        return jsonify({
            "success": True,
            "count": len(formatted_candidates),
            "candidates": formatted_candidates
        }), 200

    except Exception as e:
        print(f"Error in get_drive_candidates_controller: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


def get_all_drives_candidates_controller():
    """
    Alternative: Fetch candidates grouped by drive_id
    Useful if you want to show all drives and their candidates
    """
    print("Get all  drive controller called")
    try:
        company_id = request.args.get('company_id')
        
        if not company_id:
            return jsonify({
                "success": False,
                "error": "Company ID is required"
            }), 400

        # Get all drives for the company
        drives = list(db["drives"].find(
            {"company_id": company_id},
            {"_id": 1, "title": 1}
        ))

        result = []
        
        for drive in drives:
            drive_id = str(drive["_id"])
            
            # Get candidates for this drive
            drive_candidates = list(db["drive_candidates"].find(
                {"drive_id": drive_id},
                {"candidate_id": 1, "_id": 0}
            ))
            
            candidate_ids = [dc["candidate_id"] for dc in drive_candidates if "candidate_id" in dc]
            
            # Fetch candidate details
            candidates_count = len(candidate_ids)
            
            result.append({
                "drive_id": drive_id,
                "drive_title": drive.get("title", "Untitled Drive"),
                "candidates_count": candidates_count
            })

        return jsonify({
            "success": True,
            "drives": result
        }), 200

    except Exception as e:
        print(f"Error in get_all_drives_candidates_controller: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
