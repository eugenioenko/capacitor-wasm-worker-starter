// @ts-ignore
importScripts("/wasm_exec.js");

// Declare the WASM functions (will be set after WASM loads)
interface Wasm {
  asyncFunc: () => Promise<boolean>;
  syncFunc: () => boolean;
}

declare let wasmLib: Wasm;

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
  wasmLib = (self as any).wasm as Wasm;
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, payload, id } = event.data;
  if (typeof wasmLib === "undefined") {
    await initWasmLib();
  }
  let result: any = undefined;
  try {
    switch (type) {
      case "syncFunc":
        result = wasmLib.syncFunc!();
        break;
      case "asyncFunc":
        result = await wasmLib.asyncFunc!();
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
