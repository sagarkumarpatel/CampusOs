import os
import re

base_path = r'c:\Users\sagar\OneDrive\Desktop\CampusOsProject\backend\src\modules'

# Fix routes not passing next
def fix_routes():
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file == 'routes.ts':
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace (req, res, next) => controller.method(req, res) with (req, res, next) => controller.method(req, res, next)
                content = re.sub(r'\(req, res, next\) => controller\.(\w+)\(req, res\)', r'(req, res, next) => controller.\1(req, res, next)', content)
                
                # Also for auth/routes.ts where I had catch(next)
                content = re.sub(r'\(req, res, next\) => controller\.(\w+)\(req, res\)\.catch\(next\)', r'(req, res, next) => controller.\1(req, res, next)', content)

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

# Fix controllers not importing NextFunction
def fix_controllers():
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file == 'controller.ts':
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'NextFunction' not in content:
                    # Sometimes it's import { Request, Response } from "express"; or single quotes.
                    content = re.sub(r'import\s+\{\s*Request\s*,\s*Response\s*\}\s+from\s+[\'"]express[\'"];', 'import { Request, Response, NextFunction } from \'express\';', content)
                    
                    if 'NextFunction' not in content:
                        # Maybe it just imports Request from express?
                        pass

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

fix_routes()
fix_controllers()
print('Fixes applied.')
