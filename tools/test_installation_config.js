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
vm.runInContext(fs.readFileSync("Installation.gs", "utf8"), context);

assert.strictEqual(context.getInstallationMode_(), "legacy");
assert.strictEqual(
  context.getConfiguredSpreadsheetId_(),
  "1yF-V02aCl7CFBjcW76TM7pKVHbPPVLQj0nRjTSB-fz0",
);

scriptProperties.INSTALLATION_MODE = "tenant";
scriptProperties.TENANT_ID = "pondok-uji";
scriptProperties.REPORT_TEMPLATE_ID = "template-uji";
assert.throws(
  () => context.getConfiguredSpreadsheetId_(),
  /SPREADSHEET_ID terlebih dahulu/,
);

scriptProperties.SPREADSHEET_ID = "spreadsheet-uji";
assert.strictEqual(context.getConfiguredSpreadsheetId_(), "spreadsheet-uji");
assert.strictEqual(context.getConfiguredReportTemplateId_(), "template-uji");

const manifest = context.PRODUCT_readInstallationManifest_();
assert.strictEqual(manifest.mode, "tenant");
assert.strictEqual(manifest.tenantId, "pondok-uji");
assert.strictEqual(manifest.spreadsheetId, "spreadsheet-uji");
assert.strictEqual(manifest.reportTemplateId, "template-uji");
assert.strictEqual(manifest.ready, false);
assert.strictEqual(
  context.INSTALL_normalizeDriveId_("https://docs.google.com/spreadsheets/d/abc_123/edit"),
  "abc_123",
);
assert.strictEqual(
  context.INSTALL_normalizeDriveId_("https://docs.google.com/document/d/doc-123/edit"),
  "doc-123",
);
assert.strictEqual(
  context.INSTALL_normalizeDriveId_("1OXuGi-oNIKT-7tQ8\u00d72QnBk11Hjw7MUCs7yQ7NBQc8NQ"),
  "1OXuGi-oNIKT-7tQ8x2QnBk11Hjw7MUCs7yQ7NBQc8NQ",
);

console.log("Installation config guard OK.");
