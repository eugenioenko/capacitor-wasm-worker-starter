//go:build js && wasm

package main

import (
	"fmt"
	"syscall/js"
	"time"
)

func wasmAsyncFunc(this js.Value, args []js.Value) interface{} {
	fmt.Println("wasmAsyncFunc called")
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(js.FuncOf(func(_ js.Value, args []js.Value) interface{} {
		resolve := args[0]
		go func() {
			time.Sleep(5 * time.Second)
			result := true
			fmt.Println("wasmSyncFunc resolved")
			resolve.Invoke(result)
		}()
		return nil
	}))
}

func wasmSyncFunc(this js.Value, args []js.Value) interface{} {
	fmt.Println("wasmSyncFunc called")
	return js.ValueOf(true)
}

func registerCallbacks() {
	wasm := js.Global().Get("Object").New()
	wasm.Set("version", "1.0.0")
	wasm.Set("asyncFunc", js.FuncOf(wasmAsyncFunc))
	wasm.Set("syncFunc", js.FuncOf(wasmSyncFunc))
	js.Global().Set("wasm", wasm)
}

func main() {
	registerCallbacks()
	select {}
}
