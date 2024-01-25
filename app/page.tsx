"use client";

import classNames from "classnames";
import MersenneTwister from "mersenne-twister";
import { colorRotate } from "./utils/colorUtils";
import chroma from "chroma-js";

function jsNumberForAddress(address: string): number {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);

  return seed;
}

type Colors = Array<string>;

const colors = [
  "#01888c", // teal
  "#fc7500", // bright orange
  "#034f5d", // dark teal
  "#f73f01", // orangered
  "#fc1960", // magenta
  "#c7144c", // raspberry
  "#f3c100", // goldenrod
  "#1598f2", // lightning blue
  "#2465e1", // sail blue
  "#f19e02", // gold
];

const wobble = 30;
const shapeCount = 4;

type FolderIconProps = { seed: string } & React.HTMLAttributes<HTMLDivElement>;

const FolderIcon = ({ className, seed }: FolderIconProps) => {
  const generator = new MersenneTwister(jsNumberForAddress(seed));
  const files = Array(shapeCount)
    .fill(0)
    .map((_, i) => i + 1);

  const genColor = (colors: Colors): string => {
    const rand = generator.random(); // purposefully call the generator once, before using it again on the next line
    const idx = Math.floor(colors.length * generator.random());
    const color = colors.splice(idx, 1)[0];
    return color;
  };

  const hueShift = (colors: Colors, g: MersenneTwister): Array<string> => {
    const amount = g.random() * 30 - wobble / 2;
    const rotate = (hex: string) => colorRotate(hex, amount);
    return colors.map(rotate);
  };

  const genShape = (remainingColors: Colors) => {
    const fill = genColor(remainingColors);

    return <div className="h-[25%]" style={{ backgroundColor: fill }} />;
  };

  const remainingColors = hueShift(colors.slice(), generator);

  return (
    <div
      className={classNames("relative flex flex-col justify-end", className)}
      style={{ aspectRatio: 1.5 }}
    >
      <div
        style={{
          backgroundColor: chroma(genColor(remainingColors)).darken().hex(),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 100,
        }}
        className="absolute top-0 w-1/3 -mb-1 h-7"
      ></div>
      <div className="overflow-hidden rounded-md z-10 h-[93%] drop-shadow-lg">
        {files.map((file) => genShape(remainingColors))}
      </div>
    </div>
  );
};

export default function Home() {
  const folders = Array(10)
    .fill(0)
    .map((_, i) => i + 1);

  const generateRandom32ByteHexString = () => {
    if (typeof window === "undefined") throw new Error("window not available");
    if (!window.crypto) throw new Error("window.crypto not available");
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  };

  return (
    <main className="grid min-h-screen items-center justify-between p-24 grid-cols-5">
      {folders.map((folder) => (
        <div className="p-2">
          <FolderIcon seed={generateRandom32ByteHexString()} />
        </div>
      ))}
    </main>
  );
}
