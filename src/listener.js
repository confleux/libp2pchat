import { createNode } from "./createNode.js";
import { stdinToStream, streamToConsole } from "./stream.js";
import { createFromJSON } from  '@libp2p/peer-id-factory';
import listenerPeerIdJson from '../ids/listener.js';

const main = async () => {
  const listenerId = await createFromJSON(listenerPeerIdJson);
  const listenerNode = await createNode({
    peerId: listenerId,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/10333']
    }
  });

  listenerNode.connectionManager.addEventListener('peer:connect', (evt) => {
    const conn = evt.detail;
    console.log(`connected to: ${conn.remotePeer.toString()}`);
  });

  await listenerNode.handle('/chat/1.0.0', async ({ stream }) => {
    stdinToStream(stream);
    streamToConsole(stream);
  });

  await listenerNode.start();

  console.log('listener has started, listening on:');
  listenerNode.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString());
  });
}

main();