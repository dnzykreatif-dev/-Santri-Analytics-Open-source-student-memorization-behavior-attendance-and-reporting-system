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
context.saveSharedCoreSettings = () => ({ ok: true, data: { source: "wrapper" } });

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
scriptProperties.CORE_LIBRARY_ID = "library-project-id-123456789012345";
scriptProperties.CORE_LIBRARY_VERSION = "2";
scriptProperties.CORE_UPDATE_CHANNEL = "canary";
scriptProperties.SPREADSHEET_ID = "spreadsheet-uji";
context.SantriCore = {
  runAction(action, args, coreContext) {
    return { ok: true, data: { source: "library", action, args, coreContext } };
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
    coreContext: {
      spreadsheetId: "spreadsheet-uji",
      reportTemplateId: "",
      properties: {
        INSTALLATION_MODE: "legacy",
        TENANT_ID: "",
        REPORT_V2_ROLLOUT: "off",
        REPORT_V2_CANARY_USERS: "",
        CORE_LIBRARY_ID: "library-project-id-123456789012345",
        CORE_LIBRARY_VERSION: "2",
        CORE_UPDATE_CHANNEL: "canary",
        CORE_LIBRARY_ENABLED: "on",
      },
    },
  },
});

const wrapperOnlyResult = context.runAppAction({
  action: "saveSharedCoreSettings",
  args: [{ CORE_LIBRARY_ENABLED: "off" }, { Role: "Admin" }],
});
assert.deepStrictEqual(JSON.parse(JSON.stringify(wrapperOnlyResult)), {
  ok: true,
  data: { source: "wrapper" },
});

vm.runInContext(fs.readFileSync("core-library/CoreHost.gs", "utf8"), context);
context.SANTRI_CORE_CONTEXT = {
  spreadsheetId: "spreadsheet-uji",
  properties: {
    CORE_LIBRARY_ID: "library-project-id-123456789012345",
    CORE_LIBRARY_VERSION: "2",
    CORE_UPDATE_CHANNEL: "canary",
    CORE_LIBRARY_ENABLED: "on",
  },
};
const release = context.PRODUCT_readReleaseStatus_();
assert.strictEqual(release.sharedCore.version, "2");
assert.strictEqual(release.sharedCore.channel, "canary");
assert.strictEqual(release.sharedCore.enabled, true);

console.log("Shared core bridge OK.");
