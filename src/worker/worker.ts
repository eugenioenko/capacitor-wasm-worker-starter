// @ts-ignore
importScripts("/wasm_exec.js");

// Declare the WASM functions (will be set after WASM loads)
interface Wasm {
  asyncFunc: () => Promise<boolean>;
  syncFunc: () => boolean;
}

declare let wasm: Wasm | undefined;

// Helper to load WASM and bind functions
async function initWasmLib() {
  const go = new (self as any).Go();
  const wasm = await fetch("/wasm.wasm?v=1.0.0");
  const wasmBuffer = await wasm.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(
    wasmBuffer,
    go.importObject
  );
  go.run(instance);
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, payload, id } = event.data;
  console.log(payload);
  if (typeof wasm === "undefined") {
    await initWasmLib();
  }
  let result: any = undefined;
  try {
    switch (type) {
      case "syncFunc":
        result = wasm?.syncFunc!();
        break;
      case "asyncFunc":
        result = await wasm?.asyncFunc!();
        break;
      default:
        throw new Error("Unknown message type: " + type);
    }
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
