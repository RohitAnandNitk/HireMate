from flask import Flask
# from routes.hiring_routes import hiring_bp

app = Flask(__name__)

# Register Blueprints
# app.register_blueprint(hiring_bp, url_prefix="/hiring")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
