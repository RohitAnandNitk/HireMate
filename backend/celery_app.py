# celery_app.py
import sys
import os

# Add the project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from celery import Celery

celery = Celery(
    "hiremate",
    broker="amqp://guest:guest@localhost:5672//",
    backend="rpc://"
)

# Configuration
celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
)

# IMPORTANT: Change autodiscover to look for tasks.py in the root
# Instead of: celery.autodiscover_tasks(['src.Tasks'])
# Just import the tasks directly
try:
    from src.Tasks import tasks
    print("✓ Tasks module imported successfully")
except Exception as e:
    print(f"✗ Failed to import tasks: {e}")
    import traceback
    traceback.print_exc()

# Remove the direct import to avoid circular dependency
# Don't do: import tasks