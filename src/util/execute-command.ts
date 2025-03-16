import { exec } from 'node:child_process';

export const executeCommand = (metadataExtractCommand: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(metadataExtractCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Shell execute error: ${error}`);
      } else if (stderr) {
        reject(`Shell execute stderr: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
