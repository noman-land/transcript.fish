import database
import sys
from convert import convert

# All of this is idempotent
# Run it as many times as you you like
# It will fill in any gaps
if __name__ == '__main__':
    try:
        convert()
    except KeyboardInterrupt:
        print('\n[ ⚡️ CTRL + C ⚡️ ] Script interrupted. Cleaning up.')
        database.close()
        sys.exit(0)
