const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const scriptProperties = {};
const context = {
  PropertiesService: {
    getScriptProperties() {
      return {
        getProperty(name) {
          return scriptProperties[name] || null;
        },
        getProperties() {
          return { ...scriptProperties };
        },
      };
    },
  },
};
vm.createContext(context);
vm.runInContext(fs.readFileSync("Config.gs", "utf8"), context);
vm.runInContext(fs.readFileSync("Code.gs", "utf8"), context);
context.getAppEntitlements = (user) => ({ ok: true, data: { role: user.Role } });

const localResult = context.runAppAction({
  action: "getAppEntitlements",
  args: [{ Role: "Admin" }],
});
assert.deepStrictEqual(JSON.parse(JSON.stringify(localResult)), {
  ok: true,
  data: { role: "Admin" },
});

scriptProperties.CORE_LIBRARY_ENABLED = "on";
scriptProperties.CORE_LIBRARY_IDENTIFIER = "SantriCore";
scriptProperties.SPREADSHEET_ID = "spreadsheet-uji";
context.SantriCore = {
  runAction(action, args) {
    return { ok: true, data: { source: "library", action, args } };
  },
};
const libraryResult = context.runAppAction({
  action: "getAppEntitlements",
  args: [{ Role: "Admin" }],
});
assert.deepStrictEqual(JSON.parse(JSON.stringify(libraryResult)), {
  ok: true,
  data: {
    source: "library",
    action: "getAppEntitlements",
    args: [{ Role: "Admin" }],
  },
});

console.log("Shared core bridge OK.");
