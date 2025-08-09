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

// Implement the hook
function useServerlessRTCImpl(): UseServerlessRTC {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<string | undefined>(undefined);

  const isSupported = useMemo(() => typeof window !== "undefined" && !!(window as any).RTCPeerConnection, []);

  const start = useCallback(async (opts?: { roomId?: string }) => {
    setError(null);
    setConnecting(true);
    try {
      roomRef.current = opts?.roomId;
      await new Promise((r) => setTimeout(r, 400)); // simulate connect
      setConnected(true);
      setPeers([]); // populate when implemented
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

// Export as BOTH named and default to satisfy any import style.
export const useServerlessRTC = useServerlessRTCImpl;
export default useServerlessRTCImpl;
