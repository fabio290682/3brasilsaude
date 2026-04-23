from pathlib import Path
import re

root = Path('src')
patterns = [
    'collection', 'transfusion', 'therapeutic', 'doador', 'paciente', 'hospital',
    'sangria', 'bolsa', 'coleta', 'triagem', 'phenotyping', 'phlebotomist',
    'bloodGroup', 'rhFactor', 'bloodType', 'hospitalReg', 'hospitalOrder'
]
regex = re.compile('|'.join(re.escape(p) for p in patterns), re.IGNORECASE)

for path in sorted(root.rglob('*.[tj]sx')):
    text = path.read_text(encoding='utf-8')
    if regex.search(text):
        print(path)
        for i, line in enumerate(text.splitlines(), 1):
            if regex.search(line):
                print(f'  {i}: {line.strip()}')
        print()
