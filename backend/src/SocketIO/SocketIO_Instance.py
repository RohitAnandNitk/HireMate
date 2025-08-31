from flask_socketio import SocketIO

# Create SocketIO instance (don't bind app here)
socketio = SocketIO(cors_allowed_origins="*")
