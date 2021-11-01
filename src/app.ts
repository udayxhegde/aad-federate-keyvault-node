const express = require("express");
var logHelper = require("./utils/loghelper");
import Vault from "./vault/vaultsecrethelper";
import providerInit from "./utils/providerinit";
import ClientAssertionCredential from './auth/clientassertioncredential';

require('dotenv-safe').config();

var port = process.env.PORT || 3001;

var app = express();
//
// initialize the logger
//
logHelper.init(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var whereRunning:any = process.env.FEDERATED_ENVIRONMENT;
var provider = providerInit(whereRunning);

var clientID:any = process.env.USE_CLIENT_ID;
var tenantID:any = process.env.USE_TENANT_ID;
var aadAuthority:any = process.env.AAD_AUTHORITY;
var credential =  new ClientAssertionCredential(clientID,
                                                tenantID,
                                                aadAuthority,
                                                provider);
                                                
var keyVaultUrl:any = process.env.KEY_VAULT_INSTANCE;
var vault = new Vault(keyVaultUrl, credential);

app.get('/secret/:name', (req:any, res:any) => {
    let secretName = req.params.name;
    vault.getKeyVaultSecret(secretName)
    .then(function(secret) {
        const statusStr="Get request return " + secret;
        res.send(statusStr);
        logHelper.logger.debug("get returned %s", statusStr);
    })
    .catch(function(error) {
        logHelper.logger.error("app get error %o", error);
    });
});

app.listen(port);
logHelper.logger.info("express now running on poprt %d", port);

