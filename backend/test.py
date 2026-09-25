import sys
import io

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from agents.graph import run_marketmind

result = run_marketmind("Analyze NIFTY for tomorrow")

print(result["final_report"])