import { useState } from 'react'
import { wasmWorkerClient } from './worker/client'

function App() {
  const [isLoading, setIsLoading] = useState(false)


  async function handleSyncFunc() {
    console.log("handleSyncFunc called");
    const result = await wasmWorkerClient.syncFunc();
    console.log(result);
  }
  async function handleAsyncFunc() {
    console.log("handleAsyncFunc called");
    setIsLoading(true);
    const result = await wasmWorkerClient.asyncFunc();
    console.log("handleAsyncFunc returned");
    console.log(result);
    setIsLoading(false);
  }

  return (
    <>
      <div className="flex flex gap-4 items-center justify-center pt-20">
        <button type="button" onClick={handleSyncFunc}>
          Call Sync Function
        </button>
        <button type="button" onClick={handleAsyncFunc} disabled={isLoading}>
          {isLoading ? "Loading..." : "Call Async Function"}
        </button>

      </div>
    </>
  )
}

export default App
