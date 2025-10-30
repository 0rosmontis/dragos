'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { Button } from '@/components/ui/button';

type CallPanelProps = {
  conversationId: string | null;
  userId: string;
  userName?: string | null;
};

type CallState = 'idle' | 'connecting' | 'in-call';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
];

export function CallPanel({ conversationId, userId, userName }: CallPanelProps) {
  const [callState, setCallState] = useState<CallState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  const signalServerUrl = process.env.NEXT_PUBLIC_SIGNAL_SERVER_URL;

  const resetCallState = useCallback(() => {
    setCallState('idle');
    setIsScreenSharing(false);
    setError(null);
  }, []);

  const cleanupMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    screenTrackRef.current?.stop();
    screenTrackRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, []);

  const cleanupConnections = useCallback(
    (notifyRemote: boolean) => {
      if (notifyRemote && socketRef.current && conversationId) {
        socketRef.current.emit('leave', { roomId: conversationId });
      }

      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
      socketRef.current = null;

      peerRef.current?.getSenders().forEach((sender) => sender.track?.stop());
      peerRef.current?.close();
      peerRef.current = null;
    },
    [conversationId]
  );

  const leaveCall = useCallback(
    (notifyRemote: boolean) => {
      cleanupConnections(notifyRemote);
      cleanupMedia();
      resetCallState();
    },
    [cleanupConnections, cleanupMedia, resetCallState]
  );

  const handleRemoteLeave = useCallback(() => {
    setError('The other participant left the call.');
    leaveCall(false);
  }, [leaveCall]);

  const registerSocketListeners = useCallback(
    (socket: Socket, peer: RTCPeerConnection) => {
      if (!conversationId) {
        return;
      }

      socket.on('user-joined', async () => {
        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socket.emit('offer', { roomId: conversationId, offer });
        } catch (offerError) {
          console.error(offerError);
          setError('Unable to start the call offer.');
        }
      });

      socket.on('offer', async ({ offer }) => {
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit('answer', { roomId: conversationId, answer });
          setCallState('in-call');
        } catch (answerError) {
          console.error(answerError);
          setError('Unable to answer the call.');
        }
      });

      socket.on('answer', async ({ answer }) => {
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
          setCallState('in-call');
        } catch (answerError) {
          console.error(answerError);
          setError('Unable to establish the call.');
        }
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (iceError) {
          console.error(iceError);
        }
      });

      socket.on('user-left', handleRemoteLeave);
      socket.on('disconnect', () => leaveCall(false));
    },
    [conversationId, handleRemoteLeave, leaveCall]
  );

  const joinCall = useCallback(async () => {
    if (!conversationId) {
      setError('Select a conversation to start a call.');
      return;
    }

    if (!signalServerUrl) {
      setError('Signal server URL is not configured. Set NEXT_PUBLIC_SIGNAL_SERVER_URL in your .env file.');
      return;
    }

    if (callState !== 'idle') {
      return;
    }

    try {
      setCallState('connecting');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      peerRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            roomId: conversationId,
            candidate: event.candidate
          });
        }
      };

      const socket = io(signalServerUrl, {
        transports: ['websocket']
      });

      socketRef.current = socket;

      registerSocketListeners(socket, peer);

      socket.on('connect', () => {
        socket.emit('join', {
          roomId: conversationId,
          userId,
          userName: userName ?? userId
        });
      });

      socket.on('connect_error', (connectError) => {
        console.error(connectError);
        setError('Unable to reach the signal server.');
        leaveCall(false);
      });

      setCallState('in-call');
      setError(null);
    } catch (mediaError) {
      console.error(mediaError);
      leaveCall(false);
      setError('Unable to access your camera or microphone.');
    }
  }, [callState, conversationId, leaveCall, registerSocketListeners, signalServerUrl, userId, userName]);

  const toggleScreenShare = useCallback(async () => {
    const peer = peerRef.current;
    const localStream = localStreamRef.current;
    if (!peer || !localStream) {
      return;
    }

    const videoSender = peer.getSenders().find((sender) => sender.track?.kind === 'video');
    if (!videoSender) {
      return;
    }

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const [screenTrack] = screenStream.getVideoTracks();
        if (!screenTrack) {
          return;
        }

        screenTrackRef.current = screenTrack;
        await videoSender.replaceTrack(screenTrack);
        setIsScreenSharing(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          if (localStream.getVideoTracks().length > 0) {
            videoSender.replaceTrack(localStream.getVideoTracks()[0]).catch(console.error);
          }
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
          setIsScreenSharing(false);
          screenTrackRef.current = null;
        };
      } catch (shareError) {
        console.error(shareError);
        setError('Screen sharing was blocked by the browser.');
      }
    } else {
      const [cameraTrack] = localStream.getVideoTracks();
      if (cameraTrack) {
        await videoSender.replaceTrack(cameraTrack);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      screenTrackRef.current?.stop();
      screenTrackRef.current = null;
      setIsScreenSharing(false);
    }
  }, [isScreenSharing]);

  useEffect(() => {
    return () => {
      leaveCall(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When switching conversations, end any active call.
    return () => {
      leaveCall(true);
    };
    // Only trigger when conversation changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <section className="space-y-3 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-200">Call & screenshare</p>
          <p className="text-xs text-slate-500">
            {conversationId
              ? 'Start a secure WebRTC call. Invite others by sharing the conversation link.'
              : 'Select a conversation to enable calling.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={joinCall} disabled={!conversationId || callState !== 'idle'}>
            {callState === 'connecting' ? 'Connecting...' : 'Join call'}
          </Button>
          <Button variant="ghost" onClick={() => leaveCall(true)} disabled={callState === 'idle'}>
            Leave
          </Button>
        </div>
      </header>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Your preview</p>
          <video
            ref={localVideoRef}
            className="h-48 w-full rounded-2xl border border-slate-900/60 bg-slate-900 object-cover"
            autoPlay
            playsInline
            muted
          />
          <Button
            variant="secondary"
            onClick={toggleScreenShare}
            disabled={callState === 'idle' || callState === 'connecting'}
          >
            {isScreenSharing ? 'Stop sharing' : 'Share screen'}
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Remote participant</p>
          <video
            ref={remoteVideoRef}
            className="h-48 w-full rounded-2xl border border-slate-900/60 bg-slate-900 object-cover"
            autoPlay
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
