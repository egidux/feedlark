/**
 * gearman.js
 *
 * @description :: Server-side logic for managing Feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const gearman = require("gearman");
const client = new gearman.Gearman("localhost", 4730 , {timeout: 3000});

// TODO: remove timeout messages when client isn't connected
client.on('timeout', () => {
  console.log("gearman client timed out");
  client.close();
});

module.exports = {
  startJob: (job_name, job_data, job_options, next) => {
    if (!job_options) {
      job_options = {
        background: true,
        encoding: "utf-8"
      };
    }
    client.connect( () => {
      client.submitJob( job_name, data=job_data, options=job_options);
      next();
    });
  }
};