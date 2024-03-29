
const envVars = require("../config/variables");


const debug = (msg) => {

  if(envVars.prodDebug == "enabled") {
    console.log(msg);
    return;
  }

  if(envVars.env !== "DEV") {
    return;
  }
  console.log(msg);
}

const error = (msg) => {
  console.error(msg);
}

const info = (msg) => {
  console.error(msg);
}

module.exports = { 
  debug,
  error,
  info
};