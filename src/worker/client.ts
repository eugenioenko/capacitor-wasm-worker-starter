// libraWorkerClient.ts - Main thread wrapper for Libra WASM service worker

export type WasmWorkerRequest = { type: "syncFunc" } | { type: "asyncFunc" };

export type WasmWorkerResponse = {
  id: number;
  result?: any;
  error?: string;
};

class WasmWorkerClient {
  private worker: Worker;
  private requestId = 0;
  private pending = new Map<number, (res: WasmWorkerResponse) => void>();

  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url)); // classic worker, not module
    this.worker.onmessage = (event: MessageEvent) => {
      const res: WasmWorkerResponse = event.data;
      const cb = this.pending.get(res.id);
      if (cb) {
        cb(res);
        this.pending.delete(res.id);
      }
    };
  }

  private call<T = any>(req: WasmWorkerRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.pending.set(id, (res) => {
        if (res.error) reject(new Error(res.error));
        else resolve(res.result);
      });
      this.worker.postMessage({ ...req, id });
    });
  }

  syncFunc() {
    return this.call({ type: "syncFunc" });
  }

  asyncFunc() {
    return this.call<string>({ type: "asyncFunc" });
  }
}

export const wasmWorkerClient = new WasmWorkerClient();
