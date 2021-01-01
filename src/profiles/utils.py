import uuid


def get_random_number():
    code = str(uuid.uuid4())[:8].replace("-", " ").lower()
    return code
