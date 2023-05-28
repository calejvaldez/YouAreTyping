# app.py
# Carlos Valdez

from flask import Flask
from .cvaldez import urtyping


def create_app():
    inner_app = Flask(__name__, static_folder=None)
    inner_app.register_blueprint(urtyping.views.bp)
    inner_app.register_blueprint(urtyping.api.bp)

    return inner_app


app = create_app()
