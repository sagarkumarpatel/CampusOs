import os
import re
import glob

# Path to backend modules
base_path = r'c:\Users\sagar\OneDrive\Desktop\CampusOsProject\backend\src\modules'

# 1. Update controllers
controller_files = glob.glob(os.path.join(base_path, '**', 'controller.ts'), recursive=True)

for file in controller_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Import NextFunction if not present
    if 'NextFunction' not in content:
        content = re.sub(r'import \{ Request, Response \}', 'import { Request, Response, NextFunction }', content)
        content = re.sub(r'import \{\s*Request,\s*Response\s*\}', 'import { Request, Response, NextFunction }', content)

    # Change method signatures to include next: NextFunction
    # This is a bit tricky, but we can just add it to all methods that take (req: Request, res: Response)
    content = re.sub(r'\(req: Request, res: Response\)', '(req: Request, res: Response, next: NextFunction)', content)

    # Replace res.status(500) returns with next(error)
    # The pattern is: return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    # Or similar for image upload failed.
    # We'll just catch any return res.status(500).*?Unknown error.*?\}?\);
    # Actually, let's just do a blanket replacement of: return res.status(500).*?;
    content = re.sub(r'return res\.status\(500\)\.json\(\{.*?\}\);', 'return next(error);', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Update routes
route_files = glob.glob(os.path.join(base_path, '**', 'routes.ts'), recursive=True)

for file in route_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # In routes, they look like: router.get('/path', (req, res) => controller.method(req, res));
    # We change it to: router.get('/path', (req, res, next) => controller.method(req, res, next));
    
    content = re.sub(r'\(req, res\) => controller\.(\w+)\(req, res\)', r'(req, res, next) => controller.\1(req, res, next)', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print('Updated controllers and routes.')
