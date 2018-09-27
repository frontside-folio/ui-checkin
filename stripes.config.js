import packageJson from './package.json'; // eslint-disable-line import/extensions

const { ...stripeDefaults } = packageJson.stripes;

export const modules = {
  app: [{
    ...stripeDefaults,
    module: '@folio/ui-checkin',
    getModule: () => require('./src/index.js').default, // eslint-disable-line global-require
    // moduleRoot: path.join(__dirname, '..'),
    description: packageJson.description,
    version: packageJson.version,
  }],
};

export const okapi = { url: 'http://localhost:9130', tenant: 'diku', token: 'something' };

export const config = {
  // autoLogin: { username: 'diku_admin', password: 'admin' }
  // logCategories: 'core,redux,connect,connect-fetch,substitute,path,mpath,mquery,action,event,perm,interface,xhr'
  logCategories: '',
  // logPrefix: 'stripes'
  // logTimestamp: false
  // showPerms: false
  // listInvisiblePerms: false
  hasAllPerms: true,
  // softLogout: false
  disableAuth: true,
};

export default { okapi, config, modules };
