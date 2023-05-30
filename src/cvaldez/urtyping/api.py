# cvaldez/urtyping/api.py
# Carlos Valdez
#
# Source code for the You Are Typing API.

from flask import Blueprint, request
import json
from tools import fetch_messages, UserExistsError, UserNotFoundError

bp = Blueprint('You Are Typing API', __name__,
               template_folder='templates',
               static_folder='static',
               url_prefix='/api/typing/')


@bp.route('/get-messages/', methods=['GET'])
def get_messages():
    ...


@bp.route("/send-message/", methods=['POST'])
def send_message():
    ...
