import { spawn } from 'child_process';

const executeCommand = (commandPrompt: string, args?: string[]) => {
  const command = spawn(commandPrompt, args, { shell: true });
  command.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  command.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  command.on('close', (code) => {
    console.log(`Command exited with code ${code}`);
  });
};

export default function run(command: string) {
  try {
    console.log('[Temporal Server]: Starting server...');
    executeCommand(command);
    return true;
  } catch (error) {
    console.error('Error:', error);
  }
}

run(`mkdir -p .temporal && temporal server start-dev --db-filename .temporal/hf-workflow-data --port 6456`);
