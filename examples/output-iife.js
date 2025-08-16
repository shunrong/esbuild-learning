"use strict";
var MyModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // examples/test-module/index.js
  var test_module_exports = {};
  __export(test_module_exports, {
    moduleFunction: () => moduleFunction,
    moduleVar: () => moduleVar
  });
  var moduleVar = "Hello from module";
  function moduleFunction() {
    const localVar = "local variable";
    console.log("Module function called:", localVar);
    return localVar;
  }
  console.log("Module loaded:", moduleVar);
  return __toCommonJS(test_module_exports);
})();
