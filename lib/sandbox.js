"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const client_1 = require("./client");
const privateKey = fs.readFileSync(`${__dirname}/auth-key.p8`);
const clientOptions = {
    apiKey: "344FP2XAW6",
    issuerId: "252f0a66-61e4-4db7-81ae-27d1c15071c8",
    privateKey
};
const client = client_1.Client.create(clientOptions);
const run = async () => {
    const appId = 1543019696;
    const buildId = await client.getBuildId(appId, '1.0.27', client_1.PlatformType.MACOS, 13);
    await client.updateBuild(buildId, { usesNonExemptEncryption: false });
};
run().then().catch((e) => {
    console.error(`Error: ${e.message}`);
    console.debug(`Stack: ${e.stack}`);
    process.exit(1);
});
//# sourceMappingURL=sandbox.js.map