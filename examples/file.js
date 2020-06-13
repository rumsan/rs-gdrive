var key_file = require("../config/google.json");
let { GDocument, GFile, GPermission } = require("../src");

let gf = new GFile({ key_file });
let gp = new GPermission({ key_file });

let listFiles = async () => {
  let res = await gf.list();
  console.log(res.data);
};

let createFolderAndAddPermission = async () => {
  //create folder
  let res = await gf.createFolder({
    name: "Second Folder"
    /** specify folderId to create within the folder **/
    //parentId: ""
  });
  console.log(res.data);

  //add write permission
  await gp.add({
    fileId: res.data.id,
    emailAddress: "",
    role: "writer"
  });
};

//listFiles();
//createFolderAndAddPermission();
