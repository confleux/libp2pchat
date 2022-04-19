import { createLibp2p } from 'libp2p';
import { TCP } from '@libp2p/tcp';
import { Noise } from '@chainsafe/libp2p-noise';
import { Mplex } from '@libp2p/mplex';
import { WebSockets } from '@libp2p/websockets';
import defaultsDeep from '@nodeutils/defaults-deep'

const DEFAULT_OPTS = {
  transports: [
    new TCP(),
    new WebSockets()
  ],
  connectionEncryption: [
    new Noise()
  ],
  streamMuxers: [
    new Mplex()
  ]
};

export const createNode = async (opts) => {
  const node = await createLibp2p(defaultsDeep(DEFAULT_OPTS, opts));

  await node.start();
  console.log("node has started");

  return node;
}
