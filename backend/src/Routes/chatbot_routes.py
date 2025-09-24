from flask import Blueprint, request, jsonify
from src.Controllers.chatbot_controller import handle_chatbot_query

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/query", methods=["POST"])
def chatbot_query():
    print("chatbot router called.")
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        response = handle_chatbot_query(user_message)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
