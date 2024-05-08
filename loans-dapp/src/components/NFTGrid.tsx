interface UserNFT {
  image: string;
  name: string;
}

interface Props {
  readonly userNFTs: ReadonlyArray<UserNFT>;
}

function NFTGrid({ userNFTs }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {userNFTs.map((nft, index) => (
        <div key={index} className="border border-gray-400 p-4">
          <img src={nft.image} alt={nft.name} className="w-full h-auto" />
          <p className="mt-2 text-center">{nft.name}</p>
        </div>
      ))}
    </div>
  );
}

export default NFTGrid;
