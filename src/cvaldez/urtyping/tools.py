# cvaldez/urtyping/tools.py
# Carlos Valdez
#
# Tools to use for the You Are Typing API.
import time
import psycopg2
from cryptography.fernet import Fernet
from collections import namedtuple
import os
import uuid
import json


DB_LINK = os.getenv("DB_LINK")
EK_3 = os.getenv("EK_3")
TOKEN_ENCRYPTION_KEY = os.getenv("TOKEN_ENCRYPTION_KEY")
RawIdentity = namedtuple('RawIdentity', ['id', 'joined', 'type', 'username'])


class UserExistsError(Exception):
    ...


class UserNotFoundError(Exception):
    ...


class Identity:
    def __init__(self, identity_id=None, username=None):
        assert identity_id or username, "Identity.__init__: identity_id or username is required."

        with psycopg2.connect(DB_LINK) as con:
            cur = con.cursor()
            cur.execute('SELECT uuid, joined, type, username FROM users WHERE uuid=%s', (identity_id,)) if \
                identity_id else cur.execute('SELECT uuid, joined, type, username FROM users WHERE username=%s',
                                             (username,))

            d = cur.fetchall()

            if len(d) == 0:
                raise UserNotFoundError
            
            d = RawIdentity(*d[0])

            self._data = {
                'id': d.id,
                'joined': d.joined,
                'type': d.type,
                'username': d.username
            }

    def id(self):
        return self._data['id']

    def username(self):
        return self._data['username']

    def joined(self):
        return self._data['joined']

    def type(self):
        return self._data['type']

    def has_totp(self) -> bool:
        with psycopg2.connect(DB_LINK) as con:
            cur = con.cursor()

            cur.execute("SELECT * FROM mfa WHERE uuid=%s AND type='SAVED'", (self.id(),))

            return bool(len(cur.fetchall()))

    @staticmethod
    def exists(username: str):
        with psycopg2.connect(DB_LINK) as con:
            cur = con.cursor()
            cur.execute("SELECT username FROM users WHERE username=%s", (username,))

            return True if len(cur.fetchall()) > 0 else False

    def json(self) -> str:
        return json.dumps({
            "id": self.id(),
            "joined": self.joined(),
            "type": self.type(),
            "username": self.username(),
            "has_totp": self.has_totp()
        }, indent=2)


def get_user_with_token(token: str) -> 'User | None':
    if not token:
        return None

    d = None
    f = Fernet(TOKEN_ENCRYPTION_KEY.encode('utf-8'))

    with psycopg2.connect(DB_LINK) as con:
        cur = con.cursor()
        cur.execute("SELECT uuid, token FROM tokens")

        for dt in cur.fetchall():
            if token == f.decrypt(dt[1].encode('utf-8')).decode('utf-8'):
                d = dt
                break

        if not d:
            return None

        if token != f.decrypt(d[1].encode('utf-8')).decode('utf-8'):
            return None

    return User(d[0])


class User(Identity):
    def __init__(self, user_id: str):
        super().__init__(identity_id=user_id)

    @staticmethod
    def create(*, username: str, user_id: str) -> 'User':
        with psycopg2.connect(DB_LINK) as con:
            cur = con.cursor()
            cur.execute("SELECT * FROM p3_users WHERE id=%s", (user_id,))

            fetched = cur.fetchall()

            if len(fetched):
                raise UserExistsError

            cur.execute("INSERT INTO p3_users(id, username) VALUES(%s, %s)", (user_id, username))
            con.commit()

        return User(user_id)

    def new_message(self, content: str, *, sender: str) -> 'Message':
        return Message.new(content, sender=sender, user_id=self.id())


class Message:
    def __init__(self, data: tuple):
        self.id = data[0]
        self.user_id = data[1]
        self.content = Fernet(EK_3.encode('utf-8')).decrypt(data[2].encode('utf-8')).decode('utf-8')
        self.timestamp = data[3]
        self.message_from = data[4]
        self.to = data[5]

    @staticmethod
    def new(content: str, *, sender: str, user_id: str) -> 'Message':
        u = User(user_id)

        content = Fernet(EK_3.encode('utf-8')).encrypt(content.encode('utf-8')).decode('utf-8')

        if u.username == sender:
            send_to = 'friend'
        else:
            send_to = u.username

        with psycopg2.connect(DB_LINK) as con:
            message_id = str(uuid.uuid4())

            cur = con.cursor()
            cur.execute('INSERT INTO p3_messages(id, user_id, content, timestamp, "from", "to") VALUES(%s, %s, %s, %s, %s, %s)', (message_id, user_id, content, time.time(), sender, send_to))
            con.commit()

            cur.execute("SELECT * FROM p3_messages WHERE id=%s", (message_id,))

            return Message(cur.fetchone())


def fetch_messages(user_id, amount=30) -> list[Message]:
    with psycopg2.connect(DB_LINK) as con:
        cur = con.cursor()
        cur.execute("SELECT * FROM p3_messages WHERE user_id=%s", (user_id,))

        fetched = cur.fetchall()[amount:]

        return [Message(x) for x in fetched]
