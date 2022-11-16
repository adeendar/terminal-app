import React from 'react'

import {render,screen} from '@testing-library/react'

import Terminal, {TEXT_error_unregistered, TEXT_submit_accessible_name,TEXT_submit_button_text, TEXT_input_accessible_name, HandleInput, register, registered} from './Terminal'

import userEvent from '@testing-library/user-event'

import { within } from '@testing-library/dom'

import { REPLFunction } from './back-end/REPLFunction'

import '@testing-library/jest-dom'
import { getFunction, TEXT_error_get_arguments, TEXT_error_get_datasource} from './back-end/getFunction'
import { statsFunction,TEXT_error_stats_fail, TEXT_error_arguments } from './back-end/statsFunction'
import { weatherFunction, TEXT_weather_bad_request, TEXT_weather_error_datasource} from './back-end/weatherFunction'
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils'

describe('setup', () => {
    beforeEach(() => {
        render(<Terminal />);
    });

/**
 * Testing the accesibility consideration for the submit button
 */
test('renders submit button', () => {
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));
    expect(buttonElement).toBeInTheDocument();
})

/**
 * Tests the accessibility consideration for the input field
 */
test('renders entry input field', () => {
    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    expect(inputBox).toBeInTheDocument();
})

/**
 * Tests that the correct error message is displayed if an invalid command is 
 * accessed via the input terminal
 */
test("unregistered command", async() => {
    const command = "invalid"
    let entry = HandleInput(command)
    expect((await entry).output).toBe(TEXT_error_unregistered)
})

/**
 * Tests that registering a new command is possible and that the new function
 * is properly added to the dictionary of registered commands
 */
test("register new command", async() => {
    const command = "sample"
    let sampleFunction: REPLFunction 
    sampleFunction = function (args : string[]) {
        return new Promise((resolve) =>
        resolve("sample function!"))
    }

    register(command, sampleFunction)
    let output = HandleInput(command)
    expect(registered.has(command)).toBe(true)
})

//Handler Testing

/**
 * Tests the proper functionality of the "get" command
 */
test('get functionality correct', async() => {
    const args: string[] = ["data/stars/four_stars.csv"]
    let output = await getFunction(args)
    expect(output).toBe('[[\"0\",\"Sol\",\"0\",\"0\"],[\"1\",\"\",\"282.43485\",\"0.00449\"],[\"2\",\"\",\"43.04329\",\"0.00285\"],[\"3\",\"\",\"277.11358\",\"0.02422\"]]')
})

/**
 * Tests that the proper error message is displayed when "get" is called without
 * any arguments (a filepath) after the command
 */
test('get functionality no arguments', async() => {
    const args: string[] = []
    let output = await getFunction(args)
    expect(output).toBe(TEXT_error_get_arguments)
})

/**
 * Tests that the proper error message is displayed when "get" is called with an invalid filepath
 * input after the command.
 */
test('get functionality invalid filepath', async() => {
    const args: string[] = ["not/valid/filepath"]
    let output = await getFunction(args)
    expect(output).toBe(TEXT_error_get_datasource)
})

//*STATS**
/**
 * This tests for the accuracy of the stats function
 */
test("stats functionality correct", async() => {
    const getArgs: string[] = ["data/stars/ten-star.csv"]
    await getFunction(getArgs)
    const statsArgs: string[] = []
    let output = await statsFunction(statsArgs)
    expect(output).toBe("rows = 10, cols = 5")
})

/**
 * Tests that the proper error message is displayed when "stats" is followed by
 * arguments.
 */
test("stats with arguments", async() => {
    const getArgs: string[] = ["data/stars/ten-star.csv"]
    await getFunction(getArgs)
    const statsArgs: string[] = ["these are args"]
    let output = await statsFunction(statsArgs)
    expect(output).toBe(TEXT_error_arguments)
})

/**
 * Tests the accuracy of the weather command. This test will likely not always run
 * properly since the NWS API updates the temperature everyday (also temperature 
 * changes everyday LOL).
 */
test('weather functionality correct', async() => {
    const args: string[] = []
    args.push("41.8268")
    args.push("-71.4") // might need to switch the order of these
    let output = await (weatherFunction(args))
    expect(typeof(output)).toBe("number") 
})

/**
 * Tests that the proper error message is displayed when the user inputs
 * "weather" without any arguments.
 */
test('weather functionality no arguments', async() => {
    const args: string[] = []
    let output = await (weatherFunction(args))
    expect(output).toBe(TEXT_weather_error_datasource)
})

//Mock User Events:

/**
 * This test mocks a call with a new registered function in the event 
 * that a front end developpper wants to add a new function and call it.
 */
 test('mock end user mock function', async() => {

    async function mockFunc() {
        return '[["a","b","c"],["d","e","f"]]'
    }

    register("mockFunc", mockFunc)

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"mockFunc data/stars/ten-star.csv")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "2 mockFunc"})
    expect(arialabel).toBeInTheDocument()
})


/**
 * This test mocks a call to get without invoking our own written API
 */
test('get w/ mock end user', async() => {

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"get data/stars/ten-star.csv")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "3 get"})
    expect(arialabel).toBeInTheDocument()
})


/**
 * This test mocks a call to the weather API to ensure that we can call the
 * handler without the server running.
 */
test('weather w/ mock end user', async() => {

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"weather 11 12")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "4 weather"})
    expect(arialabel).toBeInTheDocument()
})

/**
 * This test ensures that we can call stats without use of the API
 */
test('stats w/ mock end user', async() => {

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"stats")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "5 stats"})
    expect(arialabel).toBeInTheDocument()
})

/**
 * Tests a mock version of the get function so that the API server in the backend does not need to be used.
 */
test('mock get function', async() => {

    async function mockGet() {
        return '[["1","2","3"],["3","2","1"]]'
    }

    register("mockGet", mockGet)

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"mockGet data/stars/ten-star.csv")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "6 mockGet"})
    expect(arialabel).toBeInTheDocument()
})

/**
 * Tests a mock version of the stats function so that the API server in the backend does not need to be used
 */
test('mock stats function', async() => {

    async function mockStats() {
        return 'rows = 6, cols = 5'
    }

    register("mockStats", mockStats)

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"mockStats data/stars/ten-star.csv")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "7 mockStats"})
    expect(arialabel).toBeInTheDocument()
})

/**
 * Tests a mock version of the weather function so that the API server in the backend does not need to be used.
 */
test('mock weather function', async() => {

    async function mockWeather() {
        return '90'
    }

    register("mockWeather", mockWeather)

    const inputBox = screen.getByRole("textbox",{name: TEXT_input_accessible_name});
    const buttonElement = screen.getByText(new RegExp(TEXT_submit_button_text));

    userEvent.type(inputBox,"mockWeather data/stars/ten-star.csv")
    userEvent.click(buttonElement)
    const arialabel = await screen.findByRole(/.*/,{name: "8 mockWeather"})
    expect(arialabel).toBeInTheDocument()
})


});