const { google } = require("googleapis");
const baseCls = require("./base");
const gpermission = require("./gpermission");

const queryBuilder = (query = "", newQuery) => {
  query = query.trim();
  if (query.length > 0) return query + " and " + newQuery;
  else return newQuery;
};

module.exports = class extends baseCls {
  constructor(cfg) {
    super(cfg);
    this.client = google.drive({ version: "v3", auth: this.jwtClient });
    this.permissionClient = new gpermission(cfg);
  }

  async createFolder({ name, parents = [], fields, permissions = [] }) {
    if (!name) throw Error("Must send name");
    let fileMetadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: []
    };
    if (parents.length) fileMetadata.parents = parents;
    return this.upload({ fileMetadata, fields, permissions });
  }

  async list({ parentId, fields, pageSize, orderBy, query } = {}, gfields) {
    let q = query || "";
    if (parentId) q = queryBuilder(q, `'${parentId}' in parents`);
    fields = fields ? "," + fields : "";
    fields = `nextPageToken, files(kind,id, name, modifiedTime,createdTime, mimeType, webContentLink, webViewLink, parents, thumbnailLink ${fields})`;
    orderBy = orderBy || "modifiedTime desc";
    let params = Object.assign({ fields, pageSize, orderBy, q }, gfields);
    return this.client.files.list(params);
  }

  async listOwned(params = {}, gfields) {
    params.query = queryBuilder(params.query, "'me' in owners");
    return this.list(params, gfields);
  }

  async listSharedWithMe(params = {}, gfields) {
    params.query = queryBuilder(params.query, "sharedWithMe");
    return this.list(params, gfields);
  }

  async upload({ fileMetadata, media, fields, permissions = [] }) {
    let res = await this.client.files.create({
      resource: fileMetadata,
      media,
      fields:
        fields ||
        "kind,id, name, modifiedTime,createdTime, mimeType, webContentLink, webViewLink, parents, thumbnailLink"
    });

    if (permissions.length) {
      await this.permissionClient.add(Object.assign(permissions[0], { fileId: res.data.id }));
    }

    return res;
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
