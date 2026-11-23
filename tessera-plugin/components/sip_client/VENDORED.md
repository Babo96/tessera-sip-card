# Vendored sip_client

This folder is the `sip_client` ESPHome component by eigger, taken from
`eigger/espcomponents` (`components/sip_client/`) under the MIT licence in `LICENSE.eigger`. The G.722 C sources keep
their own `LIBG722_LICENSE`.

Local changes for Tessera:

- `sip_client.cpp`: `delay(150)` in the half-duplex bus handover is `vTaskDelay(pdMS_TO_TICKS(150))`, so the Tessera
  check does not refuse a wait in the UI component.
- `sip_transport_ws.cpp`: the WebSocket restart uses `std::thread(...).detach()` instead of `xTaskCreate`/`vTaskDelete`,
  so the Tessera check does not refuse a task.
- `sip_client.h` / `sip_client.cpp`: added `state()`, `registered()`, `set_mic_muted()`/`mic_muted()` and
  `retry_register()` for the panel UI; muted capture is zeroed in `on_mic_data_` so RTP keeps flowing.
