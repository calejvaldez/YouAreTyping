# cvaldez/urtyping/api.py
# Carlos Valdez
#
# Source code for the You Are Typing API.

from flask import Blueprint

bp = Blueprint('You Are Typing API', __name__,
               template_folder='templates',
               static_folder='static',
               url_prefix='/api/typing/')
