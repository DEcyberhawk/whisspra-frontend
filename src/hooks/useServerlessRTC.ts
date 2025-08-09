// Lightweight shim so builds don’t fail if the real RTC hook isn't implemented yet.
// Replace with your actual serverless WebRTC logic when ready.

import { useCallback, useMemo, useRef, useState } from "react";

export type PeerInfo = {
  id: string;
  label?: string;
  latencyMs?: number;
};

export type UseServerlessRTC = {
  isSupported: boolean;
  connecting: boolean;
  connected: boolean;
  peers: PeerInfo[];
  error: string | null;
  start: (opts?: { roomId?: string }) => Promise<void>;
  stop: () => void;
};

export default function useServerlessRTC(): UseServerlessRTC {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<string | undefined>(undefined);

  const isSupported = useMemo(() => typeof window !== "undefined" && !!window.RTCPeerConnection, []);

  const start = useCallback(async (opts?: { roomId?: string }) => {
    setError(null);
    setConnecting(true);
    try {
      // This is a stub. Put your signaling-less / mesh bootstrap here later.
      roomRef.current = opts?.roomId;
      // Simulate an established session after a short delay.
      await new Promise((r) => setTimeout(r, 400));
      setConnected(true);
      setPeers([]); // Populate with discovered peers when implemented.
    } catch (e: any) {
      setError(e?.message ?? "Failed to start RTC session.");
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  const stop = useCallback(() => {
    setConnected(false);
    setPeers([]);
    roomRef.current = undefined;
  }, []);

  return { isSupported, connecting, connected, peers, error, start, stop };
}
