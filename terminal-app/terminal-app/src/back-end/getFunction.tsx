import { REPLFunction } from "./REPLFunction";

let URLLoad: string = "http://localhost:1738/loadcsv?filepath="
let URLGet: string = "http://localhost:1738/getcsv"

//design notice: "get" is included to differentiate these messages from others in the testing class
export const TEXT_error_get_arguments = "ERROR: Provide 1 argument"
export const TEXT_error_get_datasource = "ERROR: Provide a valid filepath"
export const TEXT_error_get_bad_json = "ERROR: Exception thrown loading data"

//design notice: some of these error messages are impossible for the user to prompt and are instead indicators that something is
//going wrong in the backend.

/**
 * The getFunction gets the contents of a given csv filepath by making a request to the server API, which
 * can be found in the server package of this project. It returns the cotents of the CSV
 * as a Prmomise<String>
 */
let getFunction: REPLFunction;
getFunction = function (args : string[]) {
    return new Promise((resolve) => {
        if (args === undefined || args.length != 1) {
            resolve(TEXT_error_get_arguments)
        } else {
            return fetch(URLLoad + args[0])
            .then (r => 
                r.json())
            .then(r => {
                if (r.result === "success") {
                    fetch(URLGet)
                    .then(r => r.json())
                    .then(r => {
                        if (r.result === "success") {
                            resolve(JSON.stringify(r.data))
                        } else {
                            resolve(TEXT_error_get_bad_json)
                        }
                    })
                    //handling each of the possible errors that the API can produce
                } else if (r.result === "error_datasource") {
                    resolve(TEXT_error_get_datasource)
                } else if (r.result === "error_bad_request") {
                    resolve(TEXT_error_get_arguments)
                } else if (r.result === "error_bad_json") {
                    resolve(TEXT_error_get_bad_json)
                }
            })
        }
    })
}

export {getFunction}


