const pact = require('@pact-foundation/pact-node')
const path = require('path');

      let opts = {
        pactFilesOrDirs: [path.resolve(process.cwd()) + '/pacts'],
        pactBroker: "https://ebsco.pact.dius.com.au/",
        pactBrokerUsername : process.env.pactBrokerUsername,
        pactBrokerPassword : process.env.pactBrokerPassword,
        consumerVersion: '0.3',
        tags: ['latest'], 
        verbose: false
     };
      pact.publishPacts(opts).then(function () {
        console.log("pact published");
       });
