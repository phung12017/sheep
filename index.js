/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';

import Home from './src/sceens/Home';

import { name as appName } from './app.json';
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
