
import Room from './room';
import packageJson from '../../package.json';

let room = new Room({
  container: document.querySelector('#container')
});

document.querySelector('#version').innerHTML = packageJson.version;
