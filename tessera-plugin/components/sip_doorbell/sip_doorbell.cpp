#include "sip_doorbell.h"

#include <cstdio>
#include <cstring>

namespace esphome::sip_doorbell {

using tessera::Font;
using tessera::Tone;
namespace ui = tessera::ui;

namespace {

constexpr uint32_t ICON_DOORBELL = 0xF12E6;
constexpr const char *COMMAND_ENTITY = "input_text.tessera_sip_command";
constexpr const char *TOGGLE_SCRIPT = "script.tessera_sip_toggle";

int imax(int a, int b) { return a > b ? a : b; }
int imin(int a, int b) { return a < b ? a : b; }

bool phase_is(const char *phase, const char *name) { return std::strcmp(phase, name) == 0; }

void format_duration(uint32_t seconds, char *out, size_t size) {
  const uint32_t hours = seconds / 3600;
  const uint32_t minutes = (seconds / 60) % 60;
  const uint32_t secs = seconds % 60;
  if (hours != 0) {
    std::snprintf(out, size, "%u:%02u:%02u", static_cast<unsigned>(hours), static_cast<unsigned>(minutes),
                  static_cast<unsigned>(secs));
  } else {
    std::snprintf(out, size, "%02u:%02u", static_cast<unsigned>(minutes), static_cast<unsigned>(secs));
  }
}

void write_command(const char *command) {
  // The card reacts to a change of the input_text, so the same answer twice must still be a new value. The card
  // strips "|<nonce>" before it parses; keep the whole value well under the helper's length.
  char value[64];
  std::snprintf(value, sizeof(value), "%s|%lu", command, static_cast<unsigned long>(millis()));
  JsonDocument fields;
  fields["value"] = value;
  tessera::action("input_text.set_value", COMMAND_ENTITY, fields.as<JsonVariantConst>());
}

void show_part(lv_obj_t *part, bool shown) {
  if (part == nullptr) return;
  if (shown) {
    lv_obj_remove_flag(part, LV_OBJ_FLAG_HIDDEN);
  } else {
    lv_obj_add_flag(part, LV_OBJ_FLAG_HIDDEN);
  }
}

}  // namespace

// The popup shown while the doorbell rings: Answer and Decline write the command helper, which the open browser card
// listens to. It has no audio and no data of its own.
class RingPopup : public tessera::Popup {
 public:
  RingPopup(SipDoorbell *plugin, const char *title, const char *peer) : plugin_(plugin) {
    const char *shown = (title != nullptr && title[0] != '\0') ? title : plugin_->text("front_door");
    std::snprintf(title_, sizeof(title_), "%s", shown);
    std::snprintf(peer_, sizeof(peer_), "%s", peer != nullptr ? peer : "");
  }

  void open(const tessera::PopupContext &c) override {
    const int gap = ui::px(8);
    const int icon_size = c.key > 0 ? c.key : ui::mm(8);
    const int icon_line = ui::line_height(Font::ICON);

    icon_ = ui::label(c.parent, Font::ICON, theme::ACCENT);
    lv_obj_set_size(icon_, icon_size, icon_line);
    lv_obj_set_pos(icon_, 0, (icon_size - icon_line) / 2);
    lv_obj_set_style_text_align(icon_, LV_TEXT_ALIGN_CENTER, 0);
    ui::set_text(icon_, ui::icon(ICON_DOORBELL));
    ui::animate(icon_, tessera::Motion::PULSE, 1200);

    int text_x = icon_size + gap;
    int text_w = c.width - text_x - c.corner;
    const bool beside = text_w >= ui::px(90);
    if (!beside) {
      text_x = 0;
      text_w = c.width - c.corner;
    }
    const int title_y = beside ? 0 : icon_size + gap;

    title_label_ = ui::label(c.parent, Font::TITLE, theme::INK);
    lv_obj_set_pos(title_label_, text_x, title_y);
    lv_obj_set_size(title_label_, text_w, ui::line_height(Font::TITLE));
    ui::set_text(title_label_, title_);

    const int hint_y = title_y + ui::line_height(Font::TITLE) + gap / 2;
    subtitle_ = ui::text(c.parent, Font::BODY, theme::MUTED);
    lv_obj_set_pos(subtitle_, text_x, hint_y);
    lv_obj_set_width(subtitle_, text_w);
    lv_obj_set_height(subtitle_, ui::line_height(Font::BODY) * 2);
    ui::set_text(subtitle_, subtitle_text());

    const int keys_top = hint_y + ui::line_height(Font::BODY) * 2 + gap * 2;
    key_h_ = imax(ui::mm(11), c.key);
    key_gap_ = gap;
    key_w_ = (c.width - key_gap_) / 2;
    key_y_ = keys_top;

    decline_ = ui::block(c.parent, theme::KEY);
    lv_obj_set_pos(decline_, 0, key_y_);
    lv_obj_set_size(decline_, key_w_, key_h_);
    decline_text_ = ui::label(decline_, Font::BODY_LARGE, theme::INK);
    lv_obj_set_style_text_align(decline_text_, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_set_pos(decline_text_, 0, (key_h_ - ui::line_height(Font::BODY_LARGE)) / 2);
    lv_obj_set_size(decline_text_, key_w_, ui::line_height(Font::BODY_LARGE));
    ui::set_text(decline_text_, plugin_->text("popup_decline"));

    answer_ = ui::block(c.parent, theme::ACCENT);
    lv_obj_set_pos(answer_, key_w_ + key_gap_, key_y_);
    lv_obj_set_size(answer_, key_w_, key_h_);
    answer_text_ = ui::label(answer_, Font::BODY_LARGE, theme::ON_ACCENT);
    lv_obj_set_style_text_align(answer_text_, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_set_pos(answer_text_, 0, (key_h_ - ui::line_height(Font::BODY_LARGE)) / 2);
    lv_obj_set_size(answer_text_, key_w_, ui::line_height(Font::BODY_LARGE));
    ui::set_text(answer_text_, plugin_->text("popup_answer"));

    apply_colors();
  }

  void on_tap() override {
    const tessera::Point point = tessera::tap_point();
    if (point.x < 0 || point.y < key_y_ || point.y > key_y_ + key_h_) return;

    if (point.x < key_w_) {
      write_command("decline");
    } else if (point.x >= key_w_ + key_gap_ && point.x < key_w_ * 2 + key_gap_) {
      write_command("answer");
    } else {
      return;
    }
    // The popup may delete itself in close_popup; touch no member after this call.
    tessera::close_popup(plugin_);
  }

  void on_theme() override { apply_colors(); }

 private:
  const char *subtitle_text() const {
    return peer_[0] != '\0' ? peer_ : plugin_->text("ring_hint");
  }

  void apply_colors() {
    ui::set_color(icon_, theme::ACCENT);
    ui::set_color(title_label_, theme::INK);
    ui::set_color(subtitle_, theme::MUTED);
    ui::set_fill(decline_, Tone::NORMAL, theme::KEY);
    ui::set_fill(answer_, Tone::NORMAL, theme::ACCENT);
    ui::set_color(decline_text_, theme::INK);
    ui::set_color(answer_text_, theme::ON_ACCENT);
  }

  SipDoorbell *plugin_;
  char title_[48] = "";
  char peer_[48] = "";
  lv_obj_t *icon_{nullptr};
  lv_obj_t *title_label_{nullptr};
  lv_obj_t *subtitle_{nullptr};
  lv_obj_t *decline_{nullptr};
  lv_obj_t *decline_text_{nullptr};
  lv_obj_t *answer_{nullptr};
  lv_obj_t *answer_text_{nullptr};
  int key_y_{0};
  int key_w_{0};
  int key_h_{0};
  int key_gap_{0};
};

// The tile: a doorbell icon, the phase in words, a live timer while connected, the caller when there is one, and a key
// at the bottom that reads like what a tap does. A tap always asks the open browser card to toggle.
class DoorTile : public tessera::Tile {
 public:
  explicit DoorTile(SipDoorbell *plugin) : plugin_(plugin) {}

  void create(const tessera::TileContext &c) override {
    width_ = c.width;
    height_ = c.height;
    tiny_ = c.height < ui::px(90);
    compact_ = c.width < ui::px(170) || c.height < ui::px(150);
    if (c.name != nullptr && c.name[0] != '\0') {
      std::snprintf(name_, sizeof(name_), "%s", c.name);
    }

    phase_font_ = tiny_ ? Font::BODY : (compact_ ? Font::BODY : Font::HEADLINE);
    timer_font_ = tiny_ ? Font::BODY : (compact_ ? Font::BODY : Font::TITLE);
    pill_font_ = tiny_ || compact_ ? Font::BODY : Font::BODY_LARGE;

    icon_ = ui::label(c.parent, Font::ICON, theme::INK);
    icon_w_ = imax(ui::line_height(Font::ICON), ui::text_width(ui::icon(ICON_DOORBELL), Font::ICON));
    ui::set_text(icon_, ui::icon(ICON_DOORBELL));
    lv_obj_set_style_text_align(icon_, LV_TEXT_ALIGN_CENTER, 0);

    dot_ = ui::block(c.parent, theme::TRACK);
    lv_obj_set_style_radius(dot_, LV_RADIUS_CIRCLE, 0);

    title_ = ui::label(c.parent, Font::TITLE, theme::INK);
    phase_label_ = ui::label(c.parent, phase_font_, theme::MUTED);
    timer_label_ = ui::label(c.parent, timer_font_, theme::ACCENT);
    peer_label_ = ui::label(c.parent, Font::BODY, theme::MUTED);

    pill_ = ui::block(c.parent, theme::ACCENT);
    pill_text_ = ui::label(pill_, pill_font_, theme::ON_ACCENT);
    lv_obj_set_style_text_align(pill_text_, LV_TEXT_ALIGN_CENTER, 0);

    // The short layout has no room for a key: the whole tile is the target and the action is a word in the accent.
    action_ = ui::label(c.parent, pill_font_, theme::ACCENT);
    show_part(action_, false);

    apply_tone();
  }

  void on_state(JsonObjectConst data) override {
    const char *state = data["state"] | "";
    const char *peer = "";
    JsonVariantConst attributes = data["attributes"];
    if (!attributes.isNull()) peer = attributes["peer"] | "";

    const bool was_ringing = phase_is(phase_, "ringing");
    std::snprintf(phase_, sizeof(phase_), "%s", state);
    std::snprintf(peer_, sizeof(peer_), "%s", peer);
    wrong_entity_ = std::strcmp(data["wait"] | "", "wrong_entity") == 0;
    const bool ringing = phase_is(phase_, "ringing");

    if (ringing && !was_ringing) {
      if (plugin_->ring_popup() && !tessera::popup_shown(plugin_)) {
        tessera::show_popup(plugin_, [this]() { return new RingPopup(plugin_, display_title(), peer_); });
      }
    } else if (!ringing && tessera::popup_shown(plugin_)) {
      // A screen that starts while connected or offline must not keep a ring popup from an earlier page.
      tessera::close_popup(plugin_);
    }
    apply_tone();
  }

  void on_tick(uint32_t epoch) override {
    if (phase_is(phase_, "connected")) {
      if (connected_since_ == 0 && epoch != 0) connected_since_ = epoch;
    } else {
      connected_since_ = 0;
    }

    timer_[0] = '\0';
    if (connected_since_ != 0 && epoch >= connected_since_) {
      format_duration(epoch - connected_since_, timer_, sizeof(timer_));
    }

    ui::set_text(title_, display_title());
    ui::set_text(phase_label_, phase_word());
    ui::set_text(timer_label_, timer_);
    ui::set_text(peer_label_, peer_text());
    ui::set_text(pill_text_, action_word());
    layout();
  }

  void on_theme() override { apply_tone(); }

  void on_tap() override {
    if (!has_sensor()) return;  // nothing to toggle until a sensor is chosen
    tessera::action("script.turn_on", TOGGLE_SCRIPT);
  }

 private:
  const char *display_title() const {
    return name_[0] != '\0' ? name_ : plugin_->text("front_door");
  }

  bool has_sensor() const {
    if (phase_[0] == '\0' || wrong_entity_) return false;
    if (phase_is(phase_, "unknown") || phase_is(phase_, "unavailable")) return false;
    return true;
  }

  const char *phase_word() const {
    if (!has_sensor()) return plugin_->text("no_sensor");
    if (phase_is(phase_, "booting")) return plugin_->text("phase_booting");
    if (phase_is(phase_, "unregistered")) return plugin_->text("phase_unregistered");
    if (phase_is(phase_, "idle")) return plugin_->text("phase_idle");
    if (phase_is(phase_, "ringing")) return plugin_->text("phase_ringing");
    if (phase_is(phase_, "dialing")) return plugin_->text("phase_dialing");
    if (phase_is(phase_, "connected")) return plugin_->text("phase_connected");
    if (phase_is(phase_, "error")) return plugin_->text("phase_error");
    return plugin_->text("phase_unknown");
  }

  const char *action_word() const {
    if (!has_sensor()) return plugin_->text("no_sensor");
    if (phase_is(phase_, "ringing")) return plugin_->text("tap_answer");
    if (phase_is(phase_, "connected") || phase_is(phase_, "dialing")) return plugin_->text("tap_hangup");
    if (phase_is(phase_, "booting")) return plugin_->text("tap_wait");
    if (phase_is(phase_, "error")) return plugin_->text("tap_retry");
    return plugin_->text("tap_call");
  }

  std::string peer_text() const {
    const bool show = has_sensor() && peer_[0] != '\0' &&
                      (phase_is(phase_, "ringing") || phase_is(phase_, "dialing") ||
                       phase_is(phase_, "connected"));
    if (!show) return "";
    return tessera::fill(plugin_->text("caller"), "peer", peer_);
  }

  void apply_tone() {
    Tone tone = Tone::NORMAL;
    theme::Role normal = theme::MUTED;
    if (!has_sensor()) {
      tone = Tone::NORMAL;
      normal = theme::MUTED;
    } else if (phase_is(phase_, "ringing")) {
      tone = Tone::ALERT;
      normal = theme::INK;
    } else if (phase_is(phase_, "connected")) {
      tone = Tone::GOOD;
      normal = theme::INK;
    } else if (phase_is(phase_, "dialing") || phase_is(phase_, "booting")) {
      tone = Tone::ACCENT;
      normal = theme::MUTED;
    } else if (phase_is(phase_, "error")) {
      tone = Tone::ALERT;
      normal = theme::INK;
    }

    ui::set_tone(icon_, tone, theme::INK);
    ui::set_tone(phase_label_, tone, normal);
    ui::set_fill(dot_, tone, theme::MUTED);
    ui::set_color(title_, theme::INK);
    ui::set_color(timer_label_, theme::ACCENT);
    ui::set_color(peer_label_, theme::MUTED);
    ui::set_fill(pill_, Tone::NORMAL, theme::ACCENT);
    ui::set_color(pill_text_, theme::ON_ACCENT);
    ui::set_color(action_, theme::ACCENT);
  }

  void layout() {
    if (tiny_) {
      layout_strip();
      return;
    }

    const int pad = ui::px(8);
    const int gap = ui::px(6);
    const int dot = ui::mm(3);
    const int icon_h = ui::line_height(Font::ICON);
    const int title_h = ui::line_height(Font::TITLE);
    const int header_h = imax(icon_h, title_h);

    const int pill_floor = ui::line_height(pill_font_) + ui::px(10);
    const int pill_h = imin(ui::mm(12), imax(pill_floor, height_ / 6));
    const int pill_y = height_ - pad - pill_h;

    lv_obj_set_pos(icon_, pad, pad);
    lv_obj_set_size(icon_, icon_w_, icon_h);
    lv_obj_set_pos(dot_, width_ - pad - dot, pad + (header_h - dot) / 2);
    lv_obj_set_size(dot_, dot, dot);

    const int title_w = width_ - (pad + icon_w_ + gap) - pad - dot - gap;
    const bool show_title = !compact_ && title_w >= ui::px(70);
    show_part(title_, show_title);
    if (show_title) {
      lv_obj_set_pos(title_, pad + icon_w_ + gap, pad + (header_h - title_h) / 2);
      lv_obj_set_size(title_, title_w, title_h);
    }

    const int content_top = pad + header_h + gap / 2;
    const int content_bottom = pill_y - gap / 2;
    const int phase_h = ui::line_height(phase_font_);
    const int timer_h = ui::line_height(timer_font_);
    const int peer_h = ui::line_height(Font::BODY);
    const int row_h = imax(phase_h, timer_h);

    // A tile whose header and key leave less than one line for the phase is too short for the full stack: use the
    // strip below it. It keeps the phase and the key and drops the title, timer and caller.
    if (phase_h > content_bottom - content_top) {
      layout_strip();
      return;
    }

    int timer_w = timer_[0] != '\0' ? ui::text_width(timer_, timer_font_) : 0;
    timer_w = imin(timer_w, width_ / 2);

    const bool has_peer = peer_[0] != '\0' &&
                          (phase_is(phase_, "ringing") || phase_is(phase_, "dialing") ||
                           phase_is(phase_, "connected"));
    bool show_peer = has_peer;
    int group_h = row_h + (show_peer ? gap / 2 + peer_h : 0);
    if (group_h > content_bottom - content_top) {
      show_peer = false;
      group_h = row_h;
    }
    const int y = content_top + imax(0, (content_bottom - content_top - group_h) / 2);

    lv_obj_set_pos(phase_label_, pad, y);
    lv_obj_set_size(phase_label_, imax(0, width_ - 2 * pad - (timer_w != 0 ? timer_w + gap : 0)), phase_h);

    show_part(timer_label_, timer_[0] != '\0');
    if (timer_[0] != '\0') {
      lv_obj_set_pos(timer_label_, width_ - pad - timer_w, y + (row_h - timer_h) / 2);
      lv_obj_set_size(timer_label_, timer_w, timer_h);
    }

    show_part(peer_label_, show_peer);
    if (show_peer) {
      lv_obj_set_pos(peer_label_, pad, y + row_h + gap / 2);
      lv_obj_set_size(peer_label_, width_ - 2 * pad, peer_h);
    }

    show_part(pill_, has_sensor());
    show_part(pill_text_, has_sensor());
    show_part(action_, false);
    if (has_sensor()) {
      lv_obj_set_pos(pill_, pad, pill_y);
      lv_obj_set_size(pill_, width_ - 2 * pad, pill_h);
      const int pill_line = ui::line_height(pill_font_);
      lv_obj_set_pos(pill_text_, 0, (pill_h - pill_line) / 2);
      lv_obj_set_size(pill_text_, width_ - 2 * pad, pill_line);
    }
  }

  // A very short tile (the CYD's 1x1 is about 53 pixels high): one line of phase beside the icon, and the action as a
  // word in the accent under it. The whole tile is the target; the title, timer and caller wait for a larger tile.
  void layout_strip() {
    const int pad = ui::px(4);
    const int gap = ui::px(4);
    const int dot = ui::mm(2);
    const int icon_h = ui::line_height(Font::ICON);
    const int line = ui::line_height(phase_font_);
    const int pill_line = ui::line_height(pill_font_);
    const int pill_h = pill_line + ui::px(4);
    const int pill_y = height_ - pad - pill_h;
    const int content_x = pad + icon_w_ + gap;
    const int content_w = width_ - content_x - pad - dot - gap;

    lv_obj_set_pos(icon_, pad, (height_ - icon_h) / 2);
    lv_obj_set_size(icon_, icon_w_, icon_h);
    lv_obj_set_pos(dot_, width_ - pad - dot, pad);
    lv_obj_set_size(dot_, dot, dot);

    show_part(title_, false);
    show_part(timer_label_, false);
    show_part(peer_label_, false);

    lv_obj_set_pos(phase_label_, content_x, pad);
    lv_obj_set_size(phase_label_, imax(1, content_w), line);

    show_part(pill_, false);
    show_part(pill_text_, false);
    show_part(action_, has_sensor());
    if (has_sensor()) {
      lv_obj_set_pos(action_, content_x, pill_y);
      lv_obj_set_size(action_, imax(1, width_ - content_x - pad), pill_line);
    }
  }

  SipDoorbell *plugin_;
  int width_{0};
  int height_{0};
  bool compact_{false};
  bool tiny_{false};
  Font phase_font_{Font::HEADLINE};
  Font timer_font_{Font::TITLE};
  Font pill_font_{Font::BODY_LARGE};
  int icon_w_{0};
  char name_[48] = "";
  char phase_[16] = "";
  char peer_[48] = "";
  char timer_[16] = "";
  uint32_t connected_since_{0};
  bool wrong_entity_{false};

  lv_obj_t *icon_{nullptr};
  lv_obj_t *dot_{nullptr};
  lv_obj_t *title_{nullptr};
  lv_obj_t *phase_label_{nullptr};
  lv_obj_t *timer_label_{nullptr};
  lv_obj_t *peer_label_{nullptr};
  lv_obj_t *pill_{nullptr};
  lv_obj_t *pill_text_{nullptr};
  lv_obj_t *action_{nullptr};
};

void SipDoorbell::setup() {
  add_tile("door", [this]() { return new DoorTile(this); });
}

bool SipDoorbell::settings(tessera::SettingsPage &page) {
  page.icon = "\U000F12E6";
  page.toggle(text("setting_ring_popup"), [this] { return ring_popup_ != nullptr && ring_popup_->state; },
              [this](bool on) {
                if (ring_popup_ == nullptr) return;
                if (on) {
                  ring_popup_->turn_on();
                } else {
                  ring_popup_->turn_off();
                }
              });
  return true;
}

}  // namespace esphome::sip_doorbell
