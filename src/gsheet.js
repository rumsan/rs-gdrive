const { google } = require("googleapis");
const baseCls = require("./base");
const gpermission = require("./gpermission");
const gfile = require("./gfile");

module.exports = class extends baseCls {
  constructor(cfg) {
    super(cfg);
    this.client = google.sheets({ version: "v4", auth: this.jwtClient });
    this.permissionClient = new gpermission(cfg);
    this.fileClient = new gfile(cfg);
  }
};
