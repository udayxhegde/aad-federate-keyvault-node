"use strict";
import { TokenCredential } from "@azure/core-auth";
const kvSecret = require('@azure/keyvault-secrets');
var logger = require("../utils/loghelper").logger;

//
// getKeyVaultSecret reads the secret from keyvault using managed identity
//
class Vault {
    keyVaultClient:any;

    constructor(vaultUrl:string, credential:TokenCredential){
        logger.info("initialize vault  %s", vaultUrl);

        this.keyVaultClient = new kvSecret.SecretClient(vaultUrl, credential);
    }

    async getKeyVaultSecret(secretName:string) {
        logger.info("getting secret %s", secretName);
        return this.keyVaultClient.getSecret(secretName)
        .then(function(result:any) {
            logger.info("get keyvault secret %s", result.value);
            return result.value;
        })
        .catch(function(error:any) {
            logger.info("get keyvault secret error %o", error);
        });
    }

    async setKeyVaultSecret(secretName:string, secretValue: string) {

        return this.keyVaultClient.setSecret(secretName, secretValue)
        .then(function(result:any) {
            logger.info("set keyvault secret %o", result);
            return result.value;
        })
        .catch(function(error:any) {
            logger.info("set keyvault secret error %o", error);
        });
    }
}


export default Vault;

