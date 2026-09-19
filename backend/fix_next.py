import os
import re
import glob

base_path = r'c:\Users\sagar\OneDrive\Desktop\CampusOsProject\backend\src\modules'

controller_files = glob.glob(os.path.join(base_path, '**', 'controller.ts'), recursive=True)

for file in controller_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace next: NextFunction with _next: NextFunction
    content = content.replace('next: NextFunction', '_next: NextFunction')
    
    # Replace next(error) with _next(error)
    content = content.replace('next(error)', '_next(error)')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print('Updated next to _next.')
