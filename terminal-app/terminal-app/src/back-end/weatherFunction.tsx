import { REPLFunction } from "./REPLFunction";

export const TEXT_weather_bad_request = "ERROR: Provide 2 arguments (lat and lon)"
export const TEXT_weather_error_datasource = "ERROR connecting to National Weather Service API"

let URL: string = "http://localhost:1738/weather?"


/**
 * The weather handler funtion take in user commands for the lattitude and 
 * longitude and returns a Promise<String> containing the given temperature or a
 * descriptive error message. 
 * This function makes requests to the National Weather Service API via our written server.
 */
let weatherFunction: REPLFunction;
weatherFunction = function (args : string[]) {

    return new Promise((resolve) => {
        if (args === undefined) {
            resolve("args undefined!")
        } else {
            return fetch(URL + "lat=" + args[0] + "&lon=" + args[1])
            .then (r => 
                r.json())
            .then(r => {
                if (r.result === "success") {
                    resolve(r.Temperature)
                } else if (r.result === "error_bad_request") {
                    resolve(TEXT_weather_bad_request )
                } else if (r.result === "error_datasource") {
                    resolve(TEXT_weather_error_datasource)
                }
            })
        }
    })
}

export {weatherFunction}