const { execSync } = require('child_process');
const path = require('path');

console.log('Checking for circular dependencies...');

try {
  // Use madge to find circular dependencies
  const result = execSync('npx madge --circular src', {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  console.log('Circular dependencies found:');
  console.log(result);
} catch (error) {
  if (error.status === 1) {
    console.log('No circular dependencies found!');
  } else {
    console.error('Error checking for circular dependencies:');
    console.error(error.stderr || error.message);
  }
}
