import { ServerResponse } from 'http';
import React, {useState, Dispatch, SetStateAction} from 'react';
import { getFunction } from './back-end/getFunction';
import {REPLFunction} from './back-end/REPLFunction'
import './Terminal.css'

export const TEXT_submit_button_text = "Submit"
export const TEXT_submit_accessible_name = "submit button"
export const TEXT_input_accessible_name = "input repl"
export const TEXT_error_unregistered = "ERROR: Provide a registered function"
export const TEXT_command_accessible_name = "This is the command output box. All commands and their outputs will be displayed here."

// global variable used to store registered commands
export var registered = new Map<string, REPLFunction>();

// stores the number of entries for use in the aria-labels
var entryIndex = 0;

/**
 * This function is used to register commands from the front-end developper. 
 * @param prefix the command the user must input into the App that will call
 * the given handler function
 * @param handler a REPLFunction that handles the backend logic of the input 
 * command
 */
export function register(prefix: string, handler: REPLFunction) {
  registered.set(prefix, handler)
}

/**
 * This interface is used to add new guesses based on user input from the app
 */
interface NewRoundProps {
    addGuess: (guess: Entry) => any
  }

  /**
   * This interface is used to keep track of state changes between the input and the output
   */
interface Entry {
  input: string
  output: string
  ariaLabel: string
}
/**
 * This interface is used for keeping track of the commands entered to input box.
 */
interface ControlledInputProps {
    value: string, setValue: Dispatch<SetStateAction<string>>,
    ariaLabel: string 
  }

 /**
  * This function sets up the input box in our app and communicates changes to 
  * the input
  * @param param0 a ControlledInputProps with values passed in for the input that are
  * communicated to the backend by a reactive state (called in CommandInput)
  * @returns an HTML input element housing the user input
  */
function InputBox({value, setValue, ariaLabel}: ControlledInputProps) {
    return (
      <input type="text" placeholder='Enter command here!' className="repl-command-box" id="input-box"
             value={value} 
             onChange={(ev) => setValue(ev.target.value)}
             aria-label={ariaLabel}
             ></input>
    );
  }

  /**
   * This function sets up an input div with a button element and establishes a 
   * React state that communicates changes to the input to the rest of the class
   * @param param0 addGUess field of NewRoundProps which changes the value of the
   * user input
   * @returns an HTML element for the user input with a button and field for the user
   * to enter text
   */
function CommandInput({addGuess}: NewRoundProps) {
    const [value, setValue] = useState<string>('');

    return (
        <div className="repl-input">
            <InputBox value = {value} setValue = {setValue} ariaLabel = {TEXT_input_accessible_name}/>
            <button onClick={async () => {
                addGuess(await HandleInput(value))
                setValue('')
            }
            } 
            type="button" id="submit-button" aria-label={TEXT_submit_accessible_name}>{TEXT_submit_button_text}
            </button>
        </div>
    );
}

/**
 * This function processes a user's input and retrieves a promise from external APIs
 * to be displayed in the history
 * @param command the user's command
 * @returns a Promise containing an Entry 
 */
export async function HandleInput(command: string): Promise<Entry> {
  let out = "";
  const commands = command.split(" ")
  let prefix: string = commands[0]

  //entry index increases
  let ariaLabel: string = entryIndex++ + " " + prefix
  let args: string[] = commands.slice(1)
  let func = registered.get(prefix)

  if (func !== undefined){
    out = await func(args)
  } else {
    out = TEXT_error_unregistered
  }
    return ({
      input: command,
      output: out,
      ariaLabel: ariaLabel
    })
  }

/**
 * This function adds a command with its respective output to the repl-history 
 * element of the app
 * @param param0 an entry object
 * @returns a JSX element cotnaing the command input and output 
 */
function CommandHistory( {entry}: {entry: Entry}) {
    return (
  <div className="entry" aria-label={entry.ariaLabel}>
    <p><b>Command:</b> {entry.input} <br></br> <b> Output: </b> {entry.output} </p>
  </div>
    );
}

/**
 * The default function sets up the repl-history div to display command inputs 
 * and outputs and calls the CommandHistory and CommandInput functions to 
 * handle updating user input and backend output
 * @returns a JSX Element containg the contents of the app 
 */
export default function Terminal() {
    const [commands, setCommands] = useState<Entry[]>([]);
    return (
      <div className="Terminal">
          <div className="repl-history" aria-label={TEXT_command_accessible_name}>
            <p> </p>
          { commands.map( (command) => 
        <CommandHistory           
        entry={command}
         />)}
         </div>
         <hr />   
        <CommandInput         
          addGuess={(command: Entry) => {          
            const newCommands = commands.slice(); 
            newCommands.push(command)
            setCommands(newCommands) }} />
      </div>
    );
} 