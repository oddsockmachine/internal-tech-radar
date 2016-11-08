__author__    =	"Ashwini Chandrasekar(@sriniash)"
__email__     =	"ASHWINI_CHANDRASEKAR@homedepot.com"
__version__   =	"1.0"
__doc__       = "Entry point for the application"

from apps.application import app

import os

port = 8080
if 'PORT' in os.environ:
    port = int(os.getenv("PORT"))


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=port)