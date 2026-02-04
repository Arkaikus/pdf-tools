import { APITester } from "./APITester";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

export function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-row items-center gap-4 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="w-20 h-20 animate-spin-slow"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="w-20 h-20 animate-spin"
        />
      </div>

      <h1 className="text-4xl font-bold mb-2 text-gray-900">Bun + React</h1>
      <p className="text-lg text-gray-600 mb-6">
        Edit <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">src/App.tsx</code> and save to test HMR
      </p>
      <div className="w-full max-w-xl">
        <APITester />
      </div>
    </div>
  );
}

export default App;
