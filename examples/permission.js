var key_file = require("../config/google.json");
let { GDocument, GFile, GPermission } = require("../src");

let documentId = "1MKNCM_-ITzfPRGEVxPwUbiDzny3mZaA7jo_pjIZXnDs";
let gd = new GDocument({ key_file });

let createDocument = async () => {
  let res = await gd.createDocument({
    title: "My Test Document"
    /** id of google document folder **/
    // parentId: "",

    /** assign permission to email **/
    // permission: {
    //   emailAddress: "",
    //   role: "writer"
    // }
  });
  console.log(res.data);
};

let readDocument = async () => {
  let res = await gd.getDocument({ fileId: documentId });
  console.log(res.data);
};

let updateDocument = async () => {
  let res = await gd.updateDocument({
    fileId: documentId,
    requests: [
      {
        insertInlineImage: {
          location: {
            index: 1
          },
          uri: "https://assets.rumsan.com/askbhunte/assets/corona-website-title.png",
          objectSize: {
            width: {
              magnitude: 450,
              unit: "PT"
            }
          }
        }
      },
      {
        insertText: {
          location: {
            index: 1
          },
          text: "Hello There. This line was added dynamically.\n\n"
        }
      }
    ]
  });
  console.log(res.data);
};

//readDocument();
//createDocument();
//updateDocument();
