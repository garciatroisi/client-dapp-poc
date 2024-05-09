import "./App.css";
import Mint from "./components/Mint";
import NFTGrid from "./components/NFTGrid";
import MetamaskGrid from "./components/MetamaskGrid";

function App() {
  return (
    <div className="grid grid-cols-2 h-screen gap-4">
      <div className="col-span-1 flex flex-col justify-between">
        <div className="min-w-[400px] mt-2">
          <MetamaskGrid />
        </div>
      </div>
      <div className="col-span-1">
        <Mint />
        <NFTGrid />
      </div>
    </div>
  );
}
export default App;
