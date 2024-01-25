"use client";

import FolderIcon from "./components/FolderIcon";

export default function Home() {
  const folders = [
    "c56ddcb20785312c94d6417ceab2f9cc306921ba1a9a3ad949c4ef37a3052bcb",
    "34a4e06e5aa3dcd069fc8b1c5972f81ed49a8e0c04202f77e03539be1094b1e8",
    "3730fbbf6a2b82e6285bc2f33f1ee517ea8343799c48bd1b7a4cd09d968ad997",
    "56c19b84164e025ac882f8dfca6e900f39a92de058601949d473fc428fbbfa67",
    "009d3f0f8eedac9e673b242c1ec425d02488b1c2a4265bd1d7e66d16d27c0a58",
    "8c61e5b736e9ca5e1e4d359bba53ded99955f30e98de8b9d0eafe64e9f1af3c0",
    "ae05d3bf18587cf021e850235fb687fcd779d990ee753ea76277c4578751cdbc",
    "9b0f8f3024485977edf2ab82740198142f6a005bac9736197fb762b31aa36f14",
    "44df4f0df568a73f13dd76d75304d7611e91042ff2d69d3d218f80aee207398c",
    "f9e8f72d0228195c2c905cf85b360d2cf3476a27d7880dd10e4890cf16a9b76f",
  ];

  return (
    <main className="grid min-h-screen p-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {folders.map((folder) => (
        <div className="" key={folder}>
          <FolderIcon
            seed={folder}
            className="hover:scale-105 transition-all hover:transition-all hover:cursor-pointer"
          />
        </div>
      ))}
    </main>
  );
}
