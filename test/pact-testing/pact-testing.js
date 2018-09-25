const agent = require('superagent')
const API_HOST = process.env.API_HOST || 'http://localhost'
const API_PORT = process.env.API_PORT || 9130
const API_ENDPOINT = `${API_HOST}:${API_PORT}`
module.exports = function test(path, query){
  console.log(`${API_ENDPOINT}${path}${query}`);
  return agent
    .get(`${API_ENDPOINT}${path}${query}`)
    
    .set('X-Okapi-Tenant','diku')
    .set('Content-Type','application/json')
    .set('Accept','application/json')
    .then((res) => {
      console.log(res.status)
      return res
    })
};
