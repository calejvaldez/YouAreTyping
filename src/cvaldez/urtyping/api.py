# cvaldez/urtyping/api.py
# Carlos Valdez
#
# Source code for the You Are Typing API.

from flask import Blueprint, request, Response
import json
import os
from .tools import fetch_messages, UserExistsError, UserNotFoundError, get_user_with_token, Message, User

bp = Blueprint('You Are Typing API', __name__,
               template_folder='templates',
               static_folder='static',
               url_prefix='/api/typing/')


@bp.route('/register-user/', methods=['POST'])
def register_user():
    try:
        user = get_user_with_token(request.headers['Bearer'])

        if not user:
            return Response(json.dumps({"ERROR": "Unauthorized"}), status=401)
    except UserExistsError:
        return Response(json.dumps({"ERROR": "User already exists."}, status=400))
    except UserNotFoundError:
        User.create(username=request.headers['username'], user_id=user.id())

    return Response(status=200)

@bp.route('/get-messages/', methods=['GET'])
def get_messages():
    user = get_user_with_token(request.headers['Bearer'])

    if not user:
        return Response(json.dumps({'ERROR': 'Unauthorized.'}), status=401)

    return Response(json.dumps({'data': [{
        'id': x.id,
        'user_id': x.user_id,
        'content': x.content,
        'timestamp': x.timestamp,
        'from': x.message_from,
        'to': x.to
    } for x in fetch_messages(user.id())]}), status=200)


@bp.route("/send-message/", methods=['POST'])
def send_message():
    user = get_user_with_token(request.headers['Bearer'])
    data = json.loads(request.data)

    if not user:
        return Response(json.dumps(({'ERROR': 'Unauthorized'}), status=401))

    m = Message.new(data['content'], sender=data['from'], user_id=user.id())

    return Response(json.dumps({
        'id': m.id,
        'user_id': m.user_id,
        'content': m.content,
        'timestamp': m.timestamp,
        'from': m.message_from,
        'to': m.to
    }), status=200)
