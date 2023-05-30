# cvaldez/urtyping/tools.py
# Carlos Valdez
#
# Tools to use for the You Are Typing API.
import time
import psycopg2
from cryptography.fernet import Fernet
import os
import uuid


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
    def __init__(self, data: tuple):
        self.id = data[0]
        self.user_id = data[1]
        self.content = Fernet(os.getenv("3_ENCRYPTION_KEY").encode('utf-8')).decrypt(data[2].encode('utf-8')).decode('utf-8')
        self.timestamp = data[3]
        self.message_from = data[4]
        self.to = data[5]

    @staticmethod
    def new(content: str, *, sender: str, user_id: str) -> 'Message':
        u = User(user_id)
        content = Fernet(os.getenv("3_ENCRYPTION_KEY").encode('utf-8')).encrypt(content.encode('utf-8')).decode('utf-8')

        if u.username == sender:
            send_to = 'friend'
        else:
            send_to = u.username

        with psycopg2.connect(os.getenv("DB_LINK")) as con:
            message_id = uuid.uuid4()

            cur = con.cursor()
            cur.execute("INSERT INTO 3_messages(id, user_id, content, timestamp, from, to) VALUES(%s, %s, %s, %s, %s, %s)", (message_id, user_id, content, time.time(), sender, send_to))
            con.commit()

            cur.execute("SELECT * FROM 3_messages WHERE id=%s", (message_id,))

            return Message(cur.fetchone())


def fetch_messages(user_id, amount=30) -> list[Message]:
    with psycopg2.connect(os.getenv("DB_LINK")) as con:
        cur = con.cursor()
        cur.execute("SELECT * FROM 3_messages WHERE user_id=%s", (user_id,))

        fetched = cur.fetchmany(amount)

        return [Message(x) for x in fetched]
