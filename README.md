# Capacitor + Wasm + Service Worker + Tailwind

This template is a starter for Capacitor apps that use WebAssembly, Service Workers, and Tailwind CSS.

## Building WebAssembly

```bash
GOOS=js GOARCH=wasm go build -o wasm/wasm.wasm ./wasm/wasm.go
```
