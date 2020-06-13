const { google } = require("googleapis");
const baseCls = require("./base");

module.exports = class extends baseCls {
  constructor(cfg) {
    super(cfg);
    this.client = google.drive({ version: "v3", auth: this.jwtClient });
  }

  async list({ fileId }) {
    if (!fileId) throw Error("Must send fileId");
    const { data } = await this.client.permissions.list({
      fileId,
      fields: "*"
    });
    return data.permissions;
  }

  async shareLink({ fileId, role = "reader" }) {
    if (!fileId) throw Error("Must send fileId");
    return this.client.permissions.create({
      resource: {
        type: "anyone",
        role
      },
      fileId,
      fields: "*"
    });
  }

  async add({ fileId, emailAddress, role = "reader" }) {
    //roles: owner,organizer,fileOrganizer,writer,commenter,reader
    if (!fileId) throw Error("Must send fileId");
    if (emailAddress) {
      let permissions = await this.list({ fileId });
      let permission = permissions.find(d => d.emailAddress === emailAddress.toLowerCase());
      if (permission) return this.client.update({ fileId, permissionId: permission.id, role });
    }

    return this.client.permissions.create({
      resource: {
        type: "user",
        role,
        emailAddress
      },
      fileId,
      fields: "*"
    });
  }

  async update({ fileId, permissionId, emailAddress, role = "reader" }) {
    //roles: owner,organizer,fileOrganizer,writer,commenter,reader
    if (!fileId) throw Error("Must send fileId");
    if (emailAddress) {
      let permissions = await this.list({ fileId });
      let permission = permissions.find(
        d => d.emailAddress.toLowerCase() === emailAddress.toLowerCase()
      );
      if (permission) permissionId = permission.id;
    }
    if (!permissionId) throw Error("Must send permissionId");
    return this.client.permissions.update({
      resource: {
        role
      },
      permissionId,
      fileId,
      fields: "*"
    });
  }

  async delete({ fileId, permissionId, emailAddress }) {
    if (!fileId) throw Error("Must send fileId");
    if (emailAddress) {
      let permissions = await this.list({ fileId });
      let permission = permissions.find(
        d => d.emailAddress.toLowerCase() === emailAddress.toLowerCase()
      );
      if (permission) permissionId = permission.id;
      else throw Error("EmailAddress does not have permission.");
    }
    if (!permissionId) throw Error("Must send permissionId");

    return this.client.permissions.delete({
      permissionId,
      fileId
    });
  }
};
