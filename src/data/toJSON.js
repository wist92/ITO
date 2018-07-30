var fs = require('fs')
var backend = require("./Backend")

async function main() {
  user = await backend.startup("Wormi")
  fs.writeFile("./object.json", JSON.stringify(user, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    ;
    console.log("File has been created");
  });
}

main()
