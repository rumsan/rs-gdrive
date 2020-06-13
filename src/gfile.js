const { google } = require("googleapis");
const baseCls = require("./base");
const gpermission = require("./gpermission");

module.exports = class extends baseCls {
  constructor(cfg) {
    super(cfg);
    this.client = google.drive({ version: "v3", auth: this.jwtClient });
    this.permissionClient = new gpermission(cfg);
  }

  async createFolder({ name, parents, parentId }) {
    let fileMetadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: []
    };
    if (parents) fileMetadata.parents = parents;
    if (parentId) fileMetadata.parents.push(parentId);
    return this.upload({ fileMetadata });
  }

  async list({ folderId, fields } = {}) {
    let q = null;
    if (folderId) q = `'${folderId}' in parents`;
    fields =
      fields || "nextPageToken, files(kind, id, name, modifiedTime, mimeType, webContentLink)";
    return this.client.files.list({ folderId, fields, q });
  }

  async upload({ fileMetadata, media, fields }) {
    return this.client.files.create({
      resource: fileMetadata,
      media,
      fields: fields || "id, name, webContentLink"
    });
  }

  async addFileToFolder(fileId, folderId) {
    if (!fileId) throw Error("Must send fileId");
    if (!folderId) throw Error("Must send folderId");
    return this.client.files.update({
      fileId,
      addParents: folderId
    });
  }

  async delete({ fileId }) {
    if (!fileId) throw Error("Must send fileId");
    return this.client.files.delete({ fileId });
  }

  async getDocumentViewUrl(fileId) {
    let data = await this.jwtClient.authorize();
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${data.access_token}`;
  }
};
