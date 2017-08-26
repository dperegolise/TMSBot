var https = require('https');

var RiotClient = function() {


};

RiotClient.get = function(getPath) {
  console.log('get: ' + getPath);
  return getContent(getPath);
};

const getContent = function(url) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      console.log('statusCode:', response.statusCode);
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });

    // handle connection errors of the request
    request.on('error', (err) => reject(err));

  }).catch(function(e) {
      console.log('Error in promise: ' + e);
  });
};

module.exports = RiotClient;