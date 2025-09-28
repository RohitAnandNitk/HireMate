# src/tasks.py
import os
from redis import Redis
from rq import Queue

redis_url = os.environ.get('REDIS_URL', 'redis://localhost:6379')
redis_conn = Redis.from_url(redis_url)
q = Queue('default', connection=redis_conn)

def enqueue_email_task(drive_id):
    # enqueue by import-string so worker can import it safely
    q.enqueue('src.orchestrators.emailing_orchestrator.email_candidates', drive_id)
