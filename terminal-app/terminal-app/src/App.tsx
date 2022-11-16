import React from 'react';
import './App.css';
import Terminal, { register } from './Terminal';
import {getFunction} from './back-end/getFunction'
import { weatherFunction } from './back-end/weatherFunction';
import { statsFunction } from './back-end/statsFunction';
import { Server } from 'http';

// constant used in aria label for App class
export const TEXT_terminal_accessible_name = "terminal"


/**
 * The App function is the top level logival component of our terminal-app. 
 * This function creates an HTML element to house the App and invokes the Terminal
 * class which contains all the logical user-interaction components of the app
 * @returns 
 */
function App() {
  // register commands here
  {register("get", getFunction)}
  {register("stats", statsFunction)}
  {register("weather", weatherFunction)}

  return (
    <div className="App" aria-label={TEXT_terminal_accessible_name}>
      <Terminal />      
    </div>
  );
}

export default App;
