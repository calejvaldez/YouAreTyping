# cvaldez/urtyping/tools.py
# Carlos Valdez
#
# Tools to use for the You Are Typing API.
import time


class UserExistsError(Exception):
    ...


class User:
    def __init__(self, uuid=None, username=None):
        # TODO: Search database for uuid or username, then build the User
        # TODO: If the user exists, raise a UserExistsError.

        self.id: str
        self.username: str
        self.friend_name: str


class Message:
    def __init__(self, data: dict):
        self.id: str
        self.user_id: str
        self.content: str
        self.timestamp: str
        self.message_from: str
        self.to: str

    def new(self, content: str, *, sender: str):
        ...
