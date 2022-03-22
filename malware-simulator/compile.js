var child_process = require('child_process');

/*child_process.exec('./compile.sh', function(error, stdout, stderr) {
    console.log(stdout);
});*/

const https = require('https')
const options = {
  hostname: 'www.stepsecurity.io',
  port: 443,
  method: 'GET'
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()


console.log("Preinstall running")