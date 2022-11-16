# Sprint 3 README

## Project Details

**Project Name:**  Sprint 3: Command Terminal Webapp

**Team Members:** Arman Deendar (adeendar) and Owen Carson (ocarson1)

**Contributions:** The idea of creating an Entry interface to store input, output, and aria label values in a command entry object was inspired by gaiello1 and tgurth's CommandEntry interface. Additionally, the implementation of an asynchronous onClick button function was inspired by a conceptual conversation with ahurd2. Lastly, the Sprint 2 server our webapp uses was built with help from bbutaney.

**Sprint 3 Repository:** https://github.com/cs0320-f2022/sprint-3-adeendar-ocarson1
**Server Repository:** https://github.com/cs0320-f2022/sprint-2-adeendar-bbutaney

## Design Choices

Sprint 3 was built using the create-react app template. The classes we built on top of the template are organized by front end and back end (*NOTE: the front end files are located in /src outside of the /back-end folder. Not storing them in a "/front-end" folder was due to a bug in which npm start only works if the front end files are directly located in /src*).

In the front end, we made a Terminal class that handles the reactivity of the terminal interface, including updating index.html fields for the input REPL and the input history. Terminal also handles registering commands to the webapp, which are stored in a Map with command name keys and REPLFunction (an interface in the backend--more on this later) values. No specific command functionality is handled in Terminal. We did this to allow developers to have flexibility in registering and removing commands from the program without ever having to edit or delete any Terminal code.

Throughout the index.html updating done in Terminal, we included aria labels to make components of our webapp accessible for screenreaders. This includes labels for the input box and individual labels for each of the entries in the input history. Entry labels are structured as " < entry number > < commmand name > " (ex. "12 get", "0 weather") so that screenreaders can access and/or filter entries based off of when they were entered or by the name of the command.

In the back end, we wrote getFunction, statsFunction, and weatherFunction: three handlers to satisfy end-user needs. Each of these classes implements the REPLFunction interface (code is from the handout), which requires an input of an argument of strings and an output of a Promise with a string value. This interface was used so that all of our functions can be registered as commands in the terminal. If a developer wanted to add a new command, they would simply need to write the functionality in a class that implements REPLFunction and register it with a line in the main App class.

All of our function handlers access an API server built in Sprint 2 to fetch information. We chose to write a new stats endpoint in our server code for the implementation of statsFunction so that all of our handlers are consistent in how they retrieve and handle information. Errors thrown by the handlers in the Sprint 3 back end correspond with the errors thrown in server JSON responses, so it is important to note that some of the errors we handled cannot be prompted by the end-user and are instead indications that something in the backend has failed.

## Errors/Bugs

Assuming that the server is run before the webapp is used, there are no known errors or bugs in this project. 

## Tests

Testing for our program is done in the Terminal.test.tsx testing suite. Within this suite, we wrote unit and mock tests to ensure that each of the components of our webapp work independently and as a whole.

Unit testing was done to make sure that the terminal and each of our handlers work. For the terminal, this involves registering new commands, properly handling unregistered commands, and correctly rendering each of the HTML elements. For each of our handlers, we tested to make sure that correct responses are given when correct inputs are provided, and that correct error messages are given in all of the possible mistakes an end user can make (too many/few arguments, incorrect filepaths, etc.)

Mock testing was done through creating mocked functions to register and mock user events. With the mocked functions, we test registering to make sure that other developers can add new functions. With mock user events, we use mock and integration testing to ensure that commands from the user correspond with correct aria labels to be screenread. One idea we had for mock testing that we were unable to implement was tesing mock user events by finding specific output text using screen.findByText(). We were unable to find the time to implement this due to complications from our outputs being seperated by HTML elements that style the text.

## How to...

**Run Tests:** 
1. Run the server's "Server" class.
2. Run "npm test" in the terminal-app directory.

**Build and run the program:** 
1. Run the server's "Server" class.
2. Run "npm start" in the terminal-app directory.

*NOTE: Server repo linked above*