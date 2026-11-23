#pragma once

#include "esphome/core/component.h"
#include "esphome/components/switch/switch.h"
#include "esphome/components/sip_client/sip_client.h"
#include "esphome/components/smart_display/plugin_api.h"

namespace esphome::sip_doorbell {

// The plugin: a native SIP endpoint on the panel. It registers to the PBX through sip_client, draws the door tile
// and the call card, and calls the client directly. No Home Assistant helper and no browser are involved.
class SipDoorbell : public Component, public tessera::Plugin {
 public:
  void setup() override;
  void on_interval(uint32_t now_ms) override;
  bool settings(tessera::SettingsPage &page) override;
  float get_setup_priority() const override { return setup_priority::DATA; }

  void set_sip(sip_client::SipClient *sip) { sip_ = sip; }
  void set_ring_popup(switch_::Switch *ring_popup) { ring_popup_ = ring_popup; }
  void set_auto_answer(switch_::Switch *auto_answer) { auto_answer_ = auto_answer; }

  // Called from sip_client's automation triggers in plugin.yaml.
  void on_sip_registered();
  void on_sip_incoming(const std::string &caller);
  void on_sip_connected();
  void on_sip_ended();
  void on_sip_dtmf(const std::string &digit);

  // The UI's view of the native client.
  const char *phase() const;
  const char *peer() const { return peer_; }
  const char *target() const { return target_; }
  const char *station() const { return station_; }
  void set_targets(const char *target, const char *station);
  uint32_t connected_seconds() const;
  bool mic_muted() const;
  bool registered() const;
  bool ring_popup() const;
  bool auto_answer() const;

  // The card's keys.
  void call(const char *number);
  void answer();
  void decline();
  void hangup();
  void send_dtmf(const char *digits);
  void toggle_mute();
  void retry();

 private:
  void sync_ui_();

  sip_client::SipClient *sip_{nullptr};
  switch_::Switch *ring_popup_{nullptr};
  switch_::Switch *auto_answer_{nullptr};
  char peer_[64] = "";
  char target_[16] = "555";
  char station_[16] = "8000";
  char last_phase_[16] = "";
  uint32_t connected_ms_{0};
  bool ever_registered_{false};
  bool auto_answered_{false};
};

}  // namespace esphome::sip_doorbell
