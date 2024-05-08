import "./App.css";
import Mint from './components/Mint'; 
import NFTGrid from './components/NFTGrid'; 

function App() {
  const userNFTs = [
    { image: 'url_de_la_imagen_1', name: 'NFT 1' },
    { image: 'url_de_la_imagen_2', name: 'NFT 2' },
    // Agrega más objetos para representar los NFT del usuario
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <NFTGrid userNFTs={userNFTs} /> 
      </div>
      <div className="col-span-1">
        <Mint />
      </div>
    </div>
  );
}
export default App;
