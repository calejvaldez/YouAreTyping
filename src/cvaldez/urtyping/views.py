# cvaldez/urtyping/views.py
# Carlos Valdez
#
# The views for You Are Typing.

from flask import Blueprint, render_template

bp = Blueprint('You Are Typing', __name__,
               template_folder='templates',
               static_folder='static',
               url_prefix='/typing/')

@bp.route('/messages/')
def text():
    return render_template('3_typing.html')


@bp.route('/')
def index():
    return '<p>I am still working on this page. Use <a href="/typing/messages/">this</a> instead.</p>'
