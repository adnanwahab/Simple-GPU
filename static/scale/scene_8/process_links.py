import re

path = '/Users/shelbernstein/Simple-GPU/static/scale/scene_8/links.txt'

with open(path, 'r') as file:
    lines = file.readlines()

url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')

urls = [line for line in lines if url_pattern.search(line)]

with open(path, 'w') as file:
    file.writelines(urls)