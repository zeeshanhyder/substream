import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

/**
 * GET /api/v1/introspection
 * Returns the TypeScript type definitions from the .build/types directory
 */
router.get('/', async (req, res) => {
  try {
    const typesDir = path.join(process.cwd(), '.build', 'types');
    const typeDefinitions: Record<string, string> = {};

    // Recursively read all .d.ts files
    const readTypeFiles = (dir: string) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          readTypeFiles(filePath);
        } else if (file.endsWith('.d.ts')) {
          const relativePath = path.relative(typesDir, filePath);
          typeDefinitions[relativePath] = fs.readFileSync(filePath, 'utf-8');
        }
      }
    };

    readTypeFiles(typesDir);

    res.json({
      success: true,
      types: typeDefinitions,
    });
  } catch (error) {
    console.error('Error serving type definitions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve type definitions',
    });
  }
});

export default router;
