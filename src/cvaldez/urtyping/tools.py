# cvaldez/urtyping/tools.py
# Carlos Valdez
#
# Tools to use for the You Are Typing API.
import time


class UserExistsError(Exception):
    ...


class User:
    def __init__(self, uuid: str):
        # TODO: Search database for uuid or username, then build the User
        # TODO: If the user exists, raise a UserExistsError.

        self.id: str
        self.username: str

    @staticmethod
    def create(*, uuid: str) -> 'User':
        # TODO: Add the new user to the database
        ...

    def new_message(self, content: str, *, sender: str) -> 'Message':
        return Message.new(content, sender=sender, uuid=self.id)


class Message:
    def __init__(self, data: dict):
        self.id: str
        self.user_id: str
        self.content: str
        self.timestamp: str
        self.message_from: str
        self.to: str

    @staticmethod
    def new(content: str, *, sender: str, uuid: str) -> 'Message':
        ...


def fetch_messages(amount=30) -> list[Message]:
    ...
