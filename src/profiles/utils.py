import uuid


def get_random_number():
    code = str(uuid.uuid4d())[:8].replace("-", " ").lower()
    return code
