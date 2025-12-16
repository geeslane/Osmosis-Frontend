import React from "react";
import YouTubeEmbed from "./YouTubeEmbed";

export default function VideosExample() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
        <div className="space-y-5 sm:space-y-6">
          <div className="border-[1.5px] rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-4">Video Ratio 16:9</h3>
            <YouTubeEmbed videoId="dQw4w9WgXcQ" />
          </div>
          <div className="border-[1.5px] rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-4">Video Ratio 4:3</h3>
            <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="4:3" />
          </div>
        </div>
        <div className="space-y-5 sm:space-y-6">
          <div className="border-[1.5px] rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-4">Video Ratio 21:9</h3>
            <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="21:9" />
          </div>
          <div className="border-[1.5px] rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-4">Video Ratio 1:1</h3>
            <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="1:1" />
          </div>
        </div>
      </div>
    </div>
  );
}
