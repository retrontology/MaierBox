import re

VALID_CATEGORY_REGEX = '^[a-zA-Z0-9 ]*$'
CATEGORY_MAX_LENGTH = 24
CATEGORY_MIN_LENGTH = 3

def validateCategory(category: str):
    length = len(category)
    if length > CATEGORY_MAX_LENGTH or length < CATEGORY_MIN_LENGTH:
        return False
    regex = re.compile(VALID_CATEGORY_REGEX)
    return regex.fullmatch(category) != None