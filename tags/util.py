import re

VALID_TAG_REGEX = '^[a-zA-Z0-9]*$'
TAG_MAX_LENGTH = 24
TAG_MIN_LENGTH = 3

def validateTag(tag: str):
    length = len(tag)
    if length > TAG_MAX_LENGTH or length < TAG_MIN_LENGTH:
        return False
    regex = re.compile(VALID_TAG_REGEX)
    return regex.fullmatch(tag) != None