import classNames from "classnames";
import MersenneTwister from "mersenne-twister";
import chroma from "chroma-js";
import React, { useMemo } from "react";

type HSL = { h: number; s: number; l: number };

export const colorRotate = (hex: string, degrees: number) => {
  let hsl = hexToHSL(hex);
  let hue = hsl.h;
  hue = (hue + degrees) % 360;
  hue = hue < 0 ? 360 + hue : hue;
  hsl.h = hue;
  return HSLToHex(hsl);
};

export const hexToHSL = (hex: string): HSL => {
  // Convert hex to RGB first
  const rStr = "0x" + hex[1] + hex[2];
  const gStr = "0x" + hex[3] + hex[4];
  const bStr = "0x" + hex[5] + hex[6];
  // Then to HSL
  const r = parseInt(rStr) / 255;
  const g = parseInt(gStr) / 255;
  const b = parseInt(bStr) / 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
};

export const HSLToHex = (hsl: HSL): string => {
  let { h, s, l } = hsl;
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  let rStr = Math.round((r + m) * 255).toString(16);
  let gStr = Math.round((g + m) * 255).toString(16);
  let bStr = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (rStr.length == 1) rStr = "0" + rStr;
  if (gStr.length == 1) gStr = "0" + gStr;
  if (bStr.length == 1) bStr = "0" + bStr;

  return "#" + rStr + gStr + bStr;
};

type FolderIconProps = { seed: string } & React.HTMLAttributes<HTMLDivElement>;

function jsNumberForAddress(address: string): number {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);

  return seed;
}

const colors = [
  "#01888c",
  "#fc7500",
  "#034f5d",
  "#f73f01",
  "#fc1960",
  "#c7144c",
  "#f3c100",
  "#1598f2",
  "#2465e1",
  "#f19e02",
];

const wobble = 30;
const shapeCount = 4;

const FolderIcon = ({ className, seed }: FolderIconProps) => {
  const generator = new MersenneTwister(jsNumberForAddress(seed));
  const files = Array(shapeCount)
    .fill(0)
    .map((_, i) => i + 1);

  const genColor = (colors: Array<string>): string => {
    const rand = generator.random(); // purposefully call the generator once, before using it again on the next line
    const idx = Math.floor(colors.length * generator.random());
    const color = colors.splice(idx, 1)[0];
    return color;
  };

  const hueShift = (
    colors: Array<string>,
    g: MersenneTwister
  ): Array<string> => {
    const amount = g.random() * 30 - wobble / 2;
    const rotate = (hex: string) => colorRotate(hex, amount);
    return colors.map(rotate);
  };

  const genShape = (
    remainingColors: Array<string>,
    index: number
  ): { color: string; node: React.JSX.Element } => {
    const fill = genColor(remainingColors);

    return {
      color: fill,
      node: (
        <div
          className="h-[25%]"
          key={index}
          style={{ backgroundColor: fill }}
        />
      ),
    };
  };

  const remainingColors = hueShift(colors.slice(), generator);

  const { bars, tipColor } = useMemo(() => {
    const bars = files.map((_f, i) => genShape(remainingColors, i));
    const tipColor = chroma(bars[0].color).darken(0.4).hex();
    return {
      bars: bars.map((bar, i) => bar.node),
      tipColor,
    };
  }, []);

  return (
    <div
      className={classNames("relative flex flex-col justify-end", className)}
      style={{ aspectRatio: 1.5 }}
    >
      <div
        style={{
          backgroundColor: tipColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 100,
        }}
        className="absolute top-0 w-[40%] -mb-1 h-7"
      ></div>
      <div className="overflow-hidden rounded-md z-10 h-[93%] drop-shadow-lg">
        {bars}
      </div>
    </div>
  );
};

export default FolderIcon;
