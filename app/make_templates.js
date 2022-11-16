const { join, basename } = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const myPath = join(__dirname, "templates");
const files = readdirSync(myPath);
files.forEach((file) => {
  const fullPath = join(myPath, file);
  console.log(fullPath);
  const content = readFileSync(fullPath, "utf8");
  //   const jsonContent = JSON.stringify(content);
  const output =
    '// eslint-disable-next-line\nconst output = atob("' +
    btoa(content) +
    '"); export default output;';
  const outputFileName = join(
    __dirname,
    "src",
    basename(file).split(".").shift() + ".ts"
  );
  writeFileSync(outputFileName, output);
});
