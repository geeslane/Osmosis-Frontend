'use client';
import React, { useState, useEffect } from 'react';

type SpeedometerProps = {
  value?: number;
  maxValue?: number;
  size?: number;
  minAngle?: number;
  maxAngle?: number;
  showValue?: boolean;
  animated?: boolean;
  arcWidth?: number;
  needleColor?: string;
  arcColor?: string;
  backgroundColor?: string;
  trackColor?: string;
};

const Speedometer: React.FC<SpeedometerProps> = ({
  value = 0,
  maxValue = 100,
  size = 200,
  minAngle = -135,
  maxAngle = 135,
  animated = true,
  arcWidth = 10,
  needleColor = '#6CBB01',
  trackColor = '#DCFFAD91',
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const duration = 1000;
      const steps = 60;
      const increment = (value - currentValue) / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        if (step <= steps) {
          setCurrentValue((prev) => prev + increment);
        } else {
          setCurrentValue(value);
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setCurrentValue(value);
    }
  // currentValue intentionally omitted to avoid restarting animation on every tick
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animated]);

  const clampedValue = Math.max(0, Math.min(currentValue, maxValue));
  const percentage = clampedValue / maxValue;
  const angle = minAngle + (maxAngle - minAngle) * percentage;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - arcWidth - 10;

  const polarToCartesian = (angleInDegrees: number, r: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCartesian(startAngle, r);
    const end = polarToCartesian(endAngle, r);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      r,
      r,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y,
    ].join(' ');
  };

  const needleEnd = polarToCartesian(angle, radius - 6);

  const dx = needleEnd.x - centerX;
  const dy = needleEnd.y - centerY;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const needleWidth = 6;

  const baseLeft = {
    x: centerX + nx * needleWidth,
    y: centerY + ny * needleWidth,
  };
  const baseRight = {
    x: centerX - nx * needleWidth,
    y: centerY - ny * needleWidth,
  };

  const needlePoints = `${baseLeft.x},${baseLeft.y} ${baseRight.x},${baseRight.y} ${needleEnd.x},${needleEnd.y}`;

  const tickMarks: {
    inner: { x: number; y: number };
    outer: { x: number; y: number };
    angle: number;
  }[] = [];

  const numberOfTicks = 11;
  for (let i = 0; i < numberOfTicks; i++) {
    const tickAngle =
      minAngle + (maxAngle - minAngle) * (i / (numberOfTicks - 1));
    const innerPoint = polarToCartesian(tickAngle, radius - arcWidth - 12);
    const outerPoint = polarToCartesian(tickAngle, radius - arcWidth - 2);
    tickMarks.push({ inner: innerPoint, outer: outerPoint, angle: tickAngle });
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size * 0.9}
        height={size * 0.9}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient
            id="speedArcGradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#6CBB01" />
            <stop offset="50%" stopColor="#6CBB01" />
            <stop offset="100%" stopColor="#6CBB01" />
          </linearGradient>
        </defs>

        {/* Dark track arc */}
        <path
          d={describeArc(minAngle, maxAngle, radius)}
          fill="none"
          stroke={trackColor}
          strokeWidth={arcWidth}
          strokeLinecap="round"
        />

        {/* Active arc */}
        <path
          d={describeArc(minAngle, angle, radius)}
          fill="none"
          stroke="url(#speedArcGradient)"
          strokeWidth={arcWidth}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 8px #7EDB3A)',
          }}
        />

        {/* Tick marks */}
        {tickMarks.map((tick, index) => (
          <line
            key={index}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke="#D9D9D9"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Center ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={18}
          fill="none"
          stroke={needleColor}
          strokeWidth="4"
          style={{
            filter: `drop-shadow(0 0 6px ${needleColor})`,
          }}
        />

        {/* Needle */}
        <polygon
          points={needlePoints}
          fill={needleColor}
          style={{
            filter: `drop-shadow(0 0 6px ${needleColor})`,
          }}
        />
        <circle cx={centerX} cy={centerY} r={6} fill={needleColor} />
      </svg>
    </div>
  );
};

export function SpeedometerDemo() {
  const [speed] = useState(0);

  return (
    <div>
      <Speedometer
        value={speed}
        maxValue={100}
        size={300}
        animated={true}
        needleColor="#7EDB3A"
        arcColor="#7EDB3A"
      />
    </div>
  );
}

export default Speedometer;
