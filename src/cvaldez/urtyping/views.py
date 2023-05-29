# cvaldez/urtyping/views.py
# Carlos Valdez
#
# The views for You Are Typing.

from flask import Blueprint, render_template

bp = Blueprint('You Are Typing', __name__,
               template_folder='templates',
               static_folder='static',
               url_prefix='/typing/')

@bp.route('/text/')
def text():
    return render_template('3_typing.html')
