#pragma once

#include "esphome/core/component.h"
#include "esphome/components/switch/switch.h"
#include "esphome/components/smart_display/plugin_api.h"

namespace esphome::sip_doorbell {

// The plugin: one tile type, and the switch that decides whether the Answer / Decline popup appears while ringing.
class SipDoorbell : public Component, public tessera::Plugin {
 public:
  void setup() override;
  float get_setup_priority() const override { return setup_priority::DATA; }
  bool settings(tessera::SettingsPage &page) override;

  void set_ring_popup(switch_::Switch *ring_popup) { ring_popup_ = ring_popup; }
  bool ring_popup() const { return ring_popup_ == nullptr || ring_popup_->state; }

 private:
  switch_::Switch *ring_popup_{nullptr};
};

}  // namespace esphome::sip_doorbell
