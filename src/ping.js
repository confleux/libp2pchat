import { createNode } from "./createNode.js";


import process from 'process';
import { multiaddr } from "multiaddr";

const main = async () => {
  const node = await createNode({
    addresses : {
      listen: ['/ip4/0.0.0.0/tcp/0']
    }
  });

  console.log('listening on addresses:')
  node.getMultiaddrs().forEach(addr => {
    console.log(`${addr.toString()}`)
  });

  if (process.argv.length >= 3) {
    const ma = multiaddr(process.argv[2]);
    console.log(`pinging remote peer at ${process.argv[2]}`);
    const latency = await node.ping(ma);
    console.log(`pinged ${process.argv[2]} in ${latency}ms`);
  } else {
    console.log('no remote peer address given');
  }

  const stop = async () => {
    await node.stop();
    console.log('libp2p has stopped');
    process.exit(0);
  }

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

main();