import autocannon from 'autocannon';
import fs from 'fs';

const BASE_URL = 'https://iharvest-six.vercel.app';

console.log('══════════════════════════════════════════════');
console.log('  iHarvest — Load/Performance Test (autocannon)');
console.log('  Equivalent to JMeter Thread Group');
console.log('  Target: ' + BASE_URL);
console.log('  Date: ' + new Date().toISOString());
console.log('══════════════════════════════════════════════\n');

const endpoints = [
  { title: 'Homepage', url: BASE_URL + '/', method: 'GET' },
  { title: 'Login Page', url: BASE_URL + '/login', method: 'GET' },
  { title: 'Firebase Auth API', url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKBp0eUFt1mb2-XqCXa5td7gZ1zCAsM-s', method: 'POST', body: JSON.stringify({email:'admin@iharvest.com',password:'123456',returnSecureToken:true}), headers: {'Content-Type':'application/json'} }
];

async function runLoadTest(endpoint) {
  return new Promise((resolve) => {
    console.log(`\n🔄 Testing: ${endpoint.title} (${endpoint.url})`);
    const opts = {
      url: endpoint.url,
      connections: 50,
      duration: 15,
      pipelining: 1,
      method: endpoint.method || 'GET',
    };
    if (endpoint.body) { opts.body = endpoint.body; opts.headers = endpoint.headers; }

    const instance = autocannon(opts, (err, result) => {
      if (err) { console.error('Error:', err); resolve(null); return; }
      console.log(`  ✅ ${endpoint.title}: avg=${result.latency.average}ms, throughput=${result.requests.average} req/s, errors=${result.errors}`);
      resolve({
        endpoint: endpoint.title,
        url: endpoint.url,
        method: endpoint.method,
        connections: 50,
        duration: '15s',
        latency: {
          average: result.latency.average,
          min: result.latency.min,
          max: result.latency.max,
          p50: result.latency.p50,
          p90: result.latency.p90,
          p99: result.latency.p99,
          stddev: result.latency.stddev
        },
        requests: {
          average: result.requests.average,
          min: result.requests.min,
          max: result.requests.max,
          total: result.requests.total,
          sent: result.requests.sent
        },
        throughput: {
          average: result.throughput.average,
          total: result.throughput.total
        },
        errors: result.errors,
        timeouts: result.timeouts,
        mismatches: result.mismatches,
        non2xx: result.non2xx,
        statusCodes: result.statusCodeStats
      });
    });

    autocannon.track(instance, { renderProgressBar: true });
  });
}

async function main() {
  const allResults = [];
  for (const ep of endpoints) {
    const r = await runLoadTest(ep);
    if (r) allResults.push(r);
  }

  console.log('\n══════════════════════════════════════════════');
  console.log('  LOAD TEST SUMMARY');
  console.log('══════════════════════════════════════════════');
  for (const r of allResults) {
    console.log(`\n  📊 ${r.endpoint}:`);
    console.log(`     Avg Response Time: ${r.latency.average}ms`);
    console.log(`     Min/Max:           ${r.latency.min}ms / ${r.latency.max}ms`);
    console.log(`     P90/P99:           ${r.latency.p90}ms / ${r.latency.p99}ms`);
    console.log(`     Throughput:        ${r.requests.average} req/s`);
    console.log(`     Total Requests:    ${r.requests.total}`);
    console.log(`     Errors:            ${r.errors}`);
    console.log(`     Non-2xx:           ${r.non2xx}`);
  }

  const report = {
    tool: 'autocannon (JMeter equivalent — Node.js)',
    jmeterEquivalent: { threads: 50, rampUp: 'immediate', duration: '15s per endpoint' },
    target: BASE_URL,
    date: new Date().toISOString(),
    results: allResults
  };
  fs.writeFileSync('tests/reports/loadtest_results.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Results saved to tests/reports/loadtest_results.json');
}

main().catch(console.error);
