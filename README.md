# Capacitor WASM Worker Starter

A modern starter template for building performant web and mobile apps using:

- **React** for UI
- **Capacitor** for native app capabilities
- **WebAssembly (WASM)** for high-performance code (e.g., Go, Rust)
- **Service Worker** to offload WASM computations from the main thread
- **Tailwind CSS** for rapid, utility-first styling

## Why this starter?

- **No main thread blocking:** WASM runs in a Service Worker, so heavy computations don't freeze your UI.
- **Cross-platform:** Build for web, iOS, and Android with a single codebase.
- **Modern stack:** React + Tailwind for fast, beautiful UIs.
- **Native features:** Use Capacitor plugins for camera, filesystem, etc.

## Project Structure

```
├── public/           # Static assets
├── src/              # React app source
│   └── assets/       # Images, icons, etc.
├── wasm/             # Go/Rust/C WASM source code
├── index.html        # App entry
├── package.json      # Project metadata & scripts
├── vite.config.ts    # Vite config for fast dev/build
└── ...
```

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Build the WASM module:**

   - Example for Go:
     ```bash
     GOOS=js GOARCH=wasm go build -o public/wasm/main.wasm wasm/wasm.go
     ```
   - (Adjust for your language/toolchain)

3. **Start the dev server:**

   ```bash
   pnpm dev
   ```

4. **Run on device (optional):**
   ```bash
   npx cap open android
   npx cap open ios
   ```

## How it works

- **WASM in Service Worker:**

  - The service worker loads and runs WASM code, handling heavy calculations.
  - The main React app communicates with the worker via `postMessage`.
  - This keeps the UI responsive, even for CPU-intensive tasks.

- **Capacitor:**

  - Wraps your web app as a native app, giving access to device APIs.

- **Tailwind CSS:**
  - Utility classes for fast, consistent styling.

## Customization

- Add your own WASM code in `wasm/` (Go, Rust, C, etc.).
- Extend the service worker for more advanced offloading.
- Use Capacitor plugins for native features.

## License

MIT
