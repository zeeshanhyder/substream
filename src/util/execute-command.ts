import { exec } from 'node:child_process';

/**
 * Executes a shell command and returns the output as a promise
 * @param commandString - Shell command to execute
 * @returns Promise resolving with command stdout
 * @throws Error with details when command fails or produces stderr
 */
export const executeCommand = (commandString: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(commandString, (error, stdout, stderr) => {
      if (error) {
        reject(`Shell execute error: ${error}`);
      } else if (stderr) {
        reject(`Shell execute stderr: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
