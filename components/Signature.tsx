'use client';
import { forwardRef } from 'react';

/** Sandra's real signature, captured stroke by stroke on the Signature Pad page. */
export const strokes = [
  'M79 79 Q61 69 55 68 Q49 67 43.5 67 Q38 67 29.5 68.5 Q21 70 17.5 72.5 Q14 75 12.5 77.5 Q11 80 11 84 Q11 88 11.5 90 Q12 92 15.5 97.5 Q19 103 25 108.5 Q31 114 42 122.5 Q53 131 71 141.5 Q89 152 93.5 156 Q98 160 99.5 163.5 Q101 167 101 171.5 Q101 176 97 181 Q93 186 85 192 Q77 198 67.5 202 Q58 206 50.5 207.5 Q43 209 34.5 209.5 Q26 210 20.5 209 Q15 208 13 206.5 Q11 205 10.5 201 Q10 197 11.5 194 Q13 191 21.5 181.5 Q30 172 52.5 154.5 Q75 137 108.5 112 Q142 87 206.5 48.5 L271 10',
  'M101 131 Q106 146 108.5 150.5 Q111 155 116 159 Q121 163 125 163.5 Q129 164 133.5 161 Q138 158 140.5 154 Q143 150 144 147 Q145 144 145 137.5 Q145 131 143.5 126 Q142 121 139.5 117.5 Q137 114 133 113.5 Q129 113 126.5 114 Q124 115 122.5 117 Q121 119 120.5 121.5 Q120 124 121 125.5 Q122 127 132 133 Q142 139 144.5 140 Q147 141 152.5 141 Q158 141 161 138.5 Q164 136 165.5 133.5 Q167 131 167.5 124 Q168 117 164.5 107.5 Q161 98 159.5 96.5 Q158 95 154.5 95 Q151 95 149.5 96.5 Q148 98 147.5 101.5 Q147 105 148 106 Q149 107 163.5 106.5 Q178 106 186.5 108 Q195 110 195 112 Q195 114 193 116.5 Q191 119 172 137.5 Q153 156 148 161 Q143 166 144 166.5 L145 167',
];

const Signature = forwardRef<SVGSVGElement, { className?: string }>(function Signature({ className }, ref) {
  return (
    <svg ref={ref} className={className} viewBox="0 0 281 220" fill="none" role="img" aria-label="Sandra's signature">
      {strokes.map((d) => (
        <path key={d.slice(0, 16)} d={d} pathLength={1} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <circle className="sig-tip" cx={0} cy={0} r={2.4} fill="currentColor" opacity={0} />
    </svg>
  );
});
export default Signature;
