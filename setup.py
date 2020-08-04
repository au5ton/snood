
import os
import requests
import shutil
import subprocess
import stat
from pathlib import Path

p = Path()
p = p / os.path.dirname(__file__) / 'bin'
p.mkdir(exist_ok=True)

youtubedl_location = os.path.join(os.path.dirname(__file__), 'bin', 'youtube-dl')
ripme_location = os.path.join(os.path.dirname(__file__), 'bin', 'ripme.jar')

with requests.get('https://yt-dl.org/downloads/latest/youtube-dl', stream=True) as r:
        with open(youtubedl_location, 'wb') as f:
            shutil.copyfileobj(r.raw, f)

with requests.get('https://github.com/RipMeApp/ripme/releases/download/1.7.92/ripme.jar', stream=True) as r:
        with open(ripme_location, 'wb') as f:
            shutil.copyfileobj(r.raw, f)

st = os.stat(youtubedl_location)
os.chmod(youtubedl_location, st.st_mode | stat.S_IEXEC)

subprocess.run(f'java -jar {ripme_location} --update', shell=True)
subprocess.run(f'{os.path.abspath(youtubedl_location)} --version', shell=True)