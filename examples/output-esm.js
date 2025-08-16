// examples/test-module/index.js
var moduleVar = "Hello from module";
function moduleFunction() {
  const localVar = "local variable";
  console.log("Module function called:", localVar);
  return localVar;
}
console.log("Module loaded:", moduleVar);
export {
  moduleFunction,
  moduleVar
};
