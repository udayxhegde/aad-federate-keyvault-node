import gcpProvider from '../auth/gcpprovider';
var logger = require("./loghelper").logger;

function providerInit(whereRunning:string) {
    let provider;

    switch(whereRunning) {
        case 'Google': 
            logger.debug("running in Google");        
            provider = new gcpProvider();
            break;
   
        default:
            throw(new Error("bad environment FEDERATED_ENVIRONMENT"));
            break;
    }
    return provider;
}

    
export default providerInit;