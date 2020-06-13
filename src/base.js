const { google } = require("googleapis");

module.exports = class {
  constructor(cfg) {
    this.client_email = cfg.client_email;
    this.private_key = cfg.private_key;
    this.scopes = [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file"
    ];
    if (cfg.key_file) {
      this.client_email = cfg.key_file.client_email;
      this.private_key = cfg.key_file.private_key;
    }

    if (cfg.scopes) this.scopes = [...this.scopes, ...cfg.scopes];

    this.jwtClient = new google.auth.JWT(
      this.client_email,
      null,
      this.private_key,
      this.scopes,
      null
    );
  }
};
