import { Multiaddr } from 'multiaddr';
import { createNode } from './createNode.js';
import { stdinToStream, streamToConsole } from './stream.js';
import { createFromJSON } from '@libp2p/peer-id-factory';
import dialerPeerIdJson from '../ids/dialer.js';
import listenerPeerIdJson from '../ids/listener.js';

const main = async () => {
  const [dialerId, listenerId] = await Promise.all([
    createFromJSON(dialerPeerIdJson),
    createFromJSON(listenerPeerIdJson)
  ]);

  const dialerNode = await createNode({
    peerId: dialerId,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    }
  });

  await dialerNode.start();

  console.log('dialer has started, listening on:');
  dialerNode.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString());
  });

  const listenerMa = new Multiaddr(`/ip4/127.0.0.1/tcp/10333/p2p/${listenerId.toString()}`);
  const { stream } = await dialerNode.dialProtocol(listenerMa, '/chat/1.0.0');

  console.log('dialer dialed to listener on protocol: /chat/1.0.0');
  console.log('type...');

  stdinToStream(stream);
  streamToConsole(stream);
}

main();
