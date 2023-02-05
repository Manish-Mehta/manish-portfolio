

const env = process.env.ENV || "DEV"

const debug = (msg) => {
  if(env !== "DEV") {
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