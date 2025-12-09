'use client';
import React from 'react';
import ReactPlayer from 'react-player';

type MediaPlayerProps = {
  url: string;
  width?: string;
  height?: string;
  controls?: boolean;
  playing?: boolean;
  onEnded?: () => void; 
};

export default function MediaPlayer({
  url,
  width = '100%',
  height = '100%',
  controls = true,
  playing = false,
  onEnded,
}: MediaPlayerProps) {
  return (
    <div className="relative aspect-video max-w-full overflow-hidden rounded-lg shadow-lg">
      <ReactPlayer
        url={url}
        width={width}
        height={height}
        controls={controls}
        playing={playing}
        onEnded={onEnded}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}
