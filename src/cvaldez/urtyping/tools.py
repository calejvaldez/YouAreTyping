# cvaldez/urtyping/tools.py
# Carlos Valdez
#
# Tools to use for the You Are Typing API.
import time
import psycopg2
from cryptography.fernet import Fernet
import os


class UserExistsError(Exception):
    ...


class UserNotFoundError(Exception):
    ...


class User:
    def __init__(self, uuid: str):
        # TODO: Search database for uuid or username, then build the User
        # TODO: If the user exists, raise a UserExistsError.

        with psycopg2.connect(os.getenv("DB_LINK")) as con:
            cur = con.cursor()

            cur.execute("SELECT * FROM 3_users WHERE uuid=%s", (uuid,))

            fetched = cur.fetchall()

            if not len(fetched):
                raise UserNotFoundError

            fetched = fetched[0]

        self.id = fetched[0]
        self.username = fetched[1]

    @staticmethod
    def create(*, username: str, uuid: str) -> 'User':
        with psycopg2.connect(os.getenv("DB_LINK")) as con:
            cur = con.cursor()
            cur.execute("SELECT * FROM 3_users WHERE uuid=%s", (uuid,))

            fetched = cur.fetchall()

            if len(fetched):
                raise UserExistsError

            cur.execute("INSERT INTO 3_users(id, username) VALUES(%s, %s)", (uuid, username))
            con.commit()

        return User(uuid)

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
