import { REPLFunction } from "./REPLFunction";

export const TEXT_error_arguments = "ERROR: Provide 0 arguments"
export const TEXT_error_stats_fail = "ERROR: Data not loaded"

let URL = "http://localhost:1738/stats"

/**
 * The stats function makes a call to the server API given a valid csv was correctly
 * loaded. The function returns the number of rows and columns for the given csv file.
 */
let statsFunction: REPLFunction;
statsFunction = function (args : string[]) {
    return new Promise((resolve) => {
        if (args.length !=0) {
            resolve(TEXT_error_arguments)
        }
            return fetch(URL)
                    .then(r => r.json())
                    .then(r => {
                        if (r.result === "success") {
                            resolve(r.data.toString())
                        } else 
                            resolve(TEXT_error_stats_fail)
                        
                    })
            })
        }
export {statsFunction}