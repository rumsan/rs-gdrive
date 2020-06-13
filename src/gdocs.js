const { google } = require("googleapis");
const baseCls = require("./base");
const gpermission = require("./gpermission");
const gfile = require("./gfile");

module.exports = class extends baseCls {
  constructor(cfg) {
    super(cfg);
    this.client = google.docs({ version: "v1", auth: this.jwtClient });
    this.permissionClient = new gpermission(cfg);
    this.fileClient = new gfile(cfg);
  }

  async getDocument({ fileId }) {
    return this.client.documents.get({
      documentId: fileId
    });
  }

  async updateDocument({ fileId, requests }) {
    return this.client.documents.batchUpdate({
      documentId: fileId,
      resource: { requests }
    });
  }

  async createDocument(data) {
    let res = await this.client.documents.create({
      title: data.title
    });

    if (data.parentId) {
      await this.fileClient.addFileToFolder(res.data.documentId, data.parentId);
    }

    if (data.permission) {
      await this.permissionClient.add(
        Object.assign(data.permission, { fileId: res.data.documentId })
      );
    }

    return res;
  }
};
