#include "sip_doorbell.h"

#include <cstdio>
#include <cstring>
#include <string>

namespace esphome::sip_doorbell {

using tessera::Font;
using tessera::Tone;
namespace ui = tessera::ui;

namespace {

constexpr uint32_t ICON_DOORBELL = 0xF12E6;
constexpr const char *DIGITS = "123456789*0#";

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

void show_part(lv_obj_t *part, bool shown) {
  if (part == nullptr) return;
  if (shown) {
    lv_obj_remove_flag(part, LV_OBJ_FLAG_HIDDEN);
  } else {
    lv_obj_add_flag(part, LV_OBJ_FLAG_HIDDEN);
  }
}

Tone tone_for(const char *phase) {
  if (phase_is(phase, "idle") || phase_is(phase, "connected")) return Tone::GOOD;
  if (phase_is(phase, "ringing") || phase_is(phase, "error") || phase_is(phase, "offline")) return Tone::ALERT;
  if (phase_is(phase, "dialing") || phase_is(phase, "registering")) return Tone::ACCENT;
  return Tone::NORMAL;
}

const char *phase_text(SipDoorbell *plugin, const char *phase) {
  if (phase_is(phase, "offline")) return plugin->text("phase_offline");
  if (phase_is(phase, "registering")) return plugin->text("phase_registering");
  if (phase_is(phase, "idle")) return plugin->text("phase_idle");
  if (phase_is(phase, "ringing")) return plugin->text("phase_ringing");
  if (phase_is(phase, "dialing")) return plugin->text("phase_dialing");
  if (phase_is(phase, "connected")) return plugin->text("phase_connected");
  if (phase_is(phase, "error")) return plugin->text("phase_error");
  return plugin->text("phase_unknown");
}

std::string peer_line(SipDoorbell *plugin) {
  const char *phase = plugin->phase();
  if (plugin->peer()[0] == '\0') return "";
  if (!phase_is(phase, "ringing") && !phase_is(phase, "dialing") && !phase_is(phase, "connected"))
    return "";
  return tessera::fill(plugin->text("peer_line"), "peer", plugin->peer());
}

}  // namespace

// The ringing popup: Answer and Decline call the native sip_client through the plugin.
class RingPopup : public tessera::Popup {
 public:
  explicit RingPopup(SipDoorbell *plugin) : plugin_(plugin) {}

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

    title_ = ui::label(c.parent, Font::TITLE, theme::INK);
    lv_obj_set_pos(title_, text_x, title_y);
    lv_obj_set_size(title_, text_w, ui::line_height(Font::TITLE));
    ui::set_text(title_, plugin_->text("front_door"));

    const int hint_y = title_y + ui::line_height(Font::TITLE) + gap / 2;
    subtitle_ = ui::text(c.parent, Font::BODY, theme::MUTED);
    lv_obj_set_pos(subtitle_, text_x, hint_y);
    lv_obj_set_width(subtitle_, text_w);
    lv_obj_set_height(subtitle_, ui::line_height(Font::BODY) * 2);
    ui::set_text(subtitle_, plugin_->peer()[0] != '\0' ? plugin_->peer() : plugin_->text("ring_hint"));

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
      plugin_->decline();
    } else if (point.x >= key_w_ + key_gap_ && point.x < key_w_ * 2 + key_gap_) {
      plugin_->answer();
    } else {
      return;
    }
    tessera::close_popup(plugin_);
  }

  void on_theme() override { apply_colors(); }

 private:
  void apply_colors() {
    ui::set_color(icon_, theme::ACCENT);
    ui::set_color(title_, theme::INK);
    ui::set_color(subtitle_, theme::MUTED);
    ui::set_fill(decline_, Tone::NORMAL, theme::KEY);
    ui::set_fill(answer_, Tone::NORMAL, theme::ACCENT);
    ui::set_color(decline_text_, theme::INK);
    ui::set_color(answer_text_, theme::ON_ACCENT);
  }

  SipDoorbell *plugin_;
  lv_obj_t *icon_{nullptr};
  lv_obj_t *title_{nullptr};
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

// The door tile: native phase, peer, registered dot and timer. A tap opens the call card.
class DoorTile : public tessera::Tile {
 public:
  explicit DoorTile(SipDoorbell *plugin) : plugin_(plugin) {}

  void create(const tessera::TileContext &c) override {
    width_ = c.width;
    height_ = c.height;
    tiny_ = c.height < ui::px(90);
    compact_ = c.width < ui::px(170) || c.height < ui::px(150);
    if (c.name != nullptr && c.name[0] != '\0') std::snprintf(name_, sizeof(name_), "%s", c.name);
    std::snprintf(target_, sizeof(target_), "%s", c.options["target"] | "555");
    std::snprintf(station_, sizeof(station_), "%s", c.options["station"] | "8000");
    tile_ = c.tile;

    phase_font_ = tiny_ ? Font::BODY : (compact_ ? Font::BODY : Font::HEADLINE);
    timer_font_ = tiny_ ? Font::BODY : (compact_ ? Font::BODY : Font::TITLE);
    pill_font_ = tiny_ || compact_ ? Font::BODY : Font::BODY_LARGE;

    icon_ = ui::label(c.parent, Font::ICON, theme::INK);
    icon_w_ = imax(ui::line_height(Font::ICON), ui::text_width(ui::icon(ICON_DOORBELL), Font::ICON));
    ui::set_text(icon_, ui::icon(ICON_DOORBELL));
    lv_obj_set_style_text_align(icon_, LV_TEXT_ALIGN_CENTER, 0);

    dot_ = ui::block(c.parent, theme::MUTED);
    lv_obj_set_style_radius(dot_, LV_RADIUS_CIRCLE, 0);

    title_ = ui::label(c.parent, Font::TITLE, theme::INK);
    phase_ = ui::label(c.parent, phase_font_, theme::INK);
    timer_ = ui::label(c.parent, timer_font_, theme::INK);
    peer_ = ui::label(c.parent, Font::BODY, theme::MUTED);

    pill_ = ui::block(c.parent, theme::ACCENT);
    pill_text_ = ui::label(pill_, pill_font_, theme::ON_ACCENT);
    lv_obj_set_style_text_align(pill_text_, LV_TEXT_ALIGN_CENTER, 0);

    action_ = ui::label(c.parent, pill_font_, theme::ACCENT);
    show_part(action_, false);

    layout();
  }

  void on_tick(uint32_t epoch) override { layout(); }
  void on_theme() override { layout(); }

  void on_tap() override {
    plugin_->set_targets(target_, station_);
    tessera::open_card(plugin_->plugin_id(), "call", "", tile_, display_title());
  }

 private:
  const char *display_title() const { return name_[0] != '\0' ? name_ : plugin_->text("front_door"); }

  void layout() {
    const char *phase = plugin_->phase();
    const Tone tone = tone_for(phase);
    const bool alert = tone == Tone::ALERT;
    char timer[16] = "";
    if (phase_is(phase, "connected") && plugin_->connected_seconds() != 0)
      format_duration(plugin_->connected_seconds(), timer, sizeof(timer));

    ui::set_text(title_, display_title());
    ui::set_text(phase_, phase_text(plugin_, phase));
    ui::set_text(timer_, timer);
    ui::set_text(peer_, peer_line(plugin_));
    ui::set_text(pill_text_, plugin_->text("tile_open"));
    ui::set_text(action_, plugin_->text("tile_open"));

    ui::set_tone(icon_, alert ? Tone::ALERT : Tone::NORMAL, theme::INK);
    ui::set_fill(dot_, tone, theme::MUTED);
    ui::set_color(title_, theme::INK);
    ui::set_color(phase_, theme::INK);
    ui::set_color(timer_, theme::INK);
    ui::set_color(peer_, theme::MUTED);
    ui::set_fill(pill_, Tone::NORMAL, theme::ACCENT);
    ui::set_color(pill_text_, theme::ON_ACCENT);
    ui::set_color(action_, theme::ACCENT);

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
    if (phase_h > content_bottom - content_top) {
      layout_strip();
      return;
    }

    int timer_w = timer[0] != '\0' ? ui::text_width(timer, timer_font_) : 0;
    timer_w = imin(timer_w, width_ / 2);
    const bool has_peer = plugin_->peer()[0] != '\0' &&
                          (phase_is(phase, "ringing") || phase_is(phase, "dialing") ||
                           phase_is(phase, "connected"));
    bool show_peer = has_peer;
    int group_h = row_h + (show_peer ? gap / 2 + peer_h : 0);
    if (group_h > content_bottom - content_top) {
      show_peer = false;
      group_h = row_h;
    }
    const int y = content_top + imax(0, (content_bottom - content_top - group_h) / 2);

    lv_obj_set_pos(phase_, pad, y);
    lv_obj_set_size(phase_, imax(0, width_ - 2 * pad - (timer_w != 0 ? timer_w + gap : 0)), phase_h);

    show_part(timer_, timer[0] != '\0');
    if (timer[0] != '\0') {
      lv_obj_set_pos(timer_, width_ - pad - dot - gap - timer_w, y + (row_h - timer_h) / 2);
      lv_obj_set_size(timer_, timer_w, timer_h);
    }

    show_part(peer_, show_peer);
    if (show_peer) {
      lv_obj_set_pos(peer_, pad, y + row_h + gap / 2);
      lv_obj_set_size(peer_, width_ - 2 * pad, peer_h);
    }

    lv_obj_set_pos(pill_, pad, pill_y);
    lv_obj_set_size(pill_, width_ - 2 * pad, pill_h);
    const int pill_line = ui::line_height(pill_font_);
    lv_obj_set_pos(pill_text_, 0, (pill_h - pill_line) / 2);
    lv_obj_set_size(pill_text_, width_ - 2 * pad, pill_line);
    show_part(pill_, true);
    show_part(pill_text_, true);
    show_part(action_, false);
  }

  void layout_strip() {
    const int pad = ui::px(4);
    const int gap = ui::px(4);
    const int dot = ui::mm(2);
    const int icon_h = ui::line_height(Font::ICON);
    const int line = ui::line_height(phase_font_);
    const int action_line = ui::line_height(pill_font_);
    const int action_y = height_ - pad - action_line;
    const int content_x = pad + icon_w_ + gap;
    const int content_w = width_ - content_x - pad - dot - gap;

    lv_obj_set_pos(icon_, pad, (height_ - icon_h) / 2);
    lv_obj_set_size(icon_, icon_w_, icon_h);
    lv_obj_set_pos(dot_, width_ - pad - dot, pad);
    lv_obj_set_size(dot_, dot, dot);

    show_part(title_, false);
    show_part(timer_, false);
    show_part(peer_, false);
    show_part(pill_, false);
    show_part(pill_text_, false);

    lv_obj_set_pos(phase_, content_x, pad);
    lv_obj_set_size(phase_, imax(1, content_w), line);

    show_part(action_, true);
    lv_obj_set_pos(action_, content_x, action_y);
    lv_obj_set_size(action_, imax(1, width_ - content_x - pad), action_line);
  }

  SipDoorbell *plugin_;
  int width_{0};
  int height_{0};
  bool tiny_{false};
  bool compact_{false};
  Font phase_font_{Font::HEADLINE};
  Font timer_font_{Font::TITLE};
  Font pill_font_{Font::BODY_LARGE};
  int icon_w_{0};
  char name_[48] = "";
  char target_[16] = "555";
  char station_[16] = "8000";
  int tile_{-1};

  lv_obj_t *icon_{nullptr};
  lv_obj_t *dot_{nullptr};
  lv_obj_t *title_{nullptr};
  lv_obj_t *phase_{nullptr};
  lv_obj_t *timer_{nullptr};
  lv_obj_t *peer_{nullptr};
  lv_obj_t *pill_{nullptr};
  lv_obj_t *pill_text_{nullptr};
  lv_obj_t *action_{nullptr};
};

// The full-screen call card: status, peer and timer, plus the keys for the current native SIP phase.
class CallCard : public tessera::Card {
 public:
  explicit CallCard(SipDoorbell *plugin) : plugin_(plugin) {}

  void open(const tessera::CardContext &c) override {
    width_ = c.width;
    height_ = c.height;

    const int pad = ui::px(12);
    const int gap = ui::px(8);
    const int min_key = ui::mm(9);
    const int icon_h = ui::line_height(Font::ICON);
    const int phase_h = ui::line_height(Font::HEADLINE);
    const int peer_h = ui::line_height(Font::BODY);
    const int timer_h = ui::line_height(Font::TITLE);
    const int header_h = imax(icon_h, imax(phase_h, timer_h));
    const int primary_h = imin(ui::mm(14), imax(ui::mm(9), c.height / 6));
    const int required = 2 * pad + header_h + peer_h + ui::px(4) + 3 * gap + primary_h +
                         4 * min_key + 3 * gap;
    show_pad_ = c.height >= required;

    icon_ = ui::label(c.parent, Font::ICON, theme::INK);
    icon_w_ = imax(icon_h, ui::text_width(ui::icon(ICON_DOORBELL), Font::ICON));
    ui::set_text(icon_, ui::icon(ICON_DOORBELL));
    lv_obj_set_style_text_align(icon_, LV_TEXT_ALIGN_CENTER, 0);

    dot_ = ui::block(c.parent, theme::MUTED);
    lv_obj_set_style_radius(dot_, LV_RADIUS_CIRCLE, 0);

    phase_ = ui::label(c.parent, Font::HEADLINE, theme::INK);
    peer_ = ui::label(c.parent, Font::BODY, theme::MUTED);
    timer_ = ui::label(c.parent, Font::TITLE, theme::INK);

    for (auto &key : keys_) make_key(key, c.parent, Font::BODY_LARGE);
    if (show_pad_) {
      for (int i = 0; i < 12; ++i) {
        make_key(pad_keys_[i], c.parent, Font::HEADLINE);
        char text[2] = {DIGITS[i], '\0'};
        ui::set_text(pad_keys_[i].label, text);
        pad_keys_[i].action = Act::DTMF;
        pad_keys_[i].digit = DIGITS[i];
        pad_keys_[i].style = Style::NEUTRAL;
      }
    }

    layout();
  }

  void on_tick(uint32_t epoch) override { layout(); }
  void on_theme() override { layout(); }

  void on_tap() override {
    const tessera::Point p = tessera::tap_point();
    if (p.x < 0 || p.y < 0) return;
    for (auto &key : keys_) {
      if (key.shown && inside(p, key)) {
        perform(key);
        return;
      }
    }
    for (auto &key : pad_keys_) {
      if (key.shown && inside(p, key)) {
        perform(key);
        return;
      }
    }
  }

 private:
  enum class Act : uint8_t {
    NONE,
    CALL_TARGET,
    CALL_STATION,
    ANSWER,
    DECLINE,
    CANCEL,
    HANGUP,
    TOGGLE_MUTE,
    OPEN_DOOR,
    RETRY,
    DTMF,
  };
  enum class Style : uint8_t { NEUTRAL, ACCENT, ALERT };

  struct Key {
    lv_obj_t *block{nullptr};
    lv_obj_t *label{nullptr};
    Font font{Font::BODY_LARGE};
    Act action{Act::NONE};
    Style style{Style::NEUTRAL};
    char digit{0};
    char text[64] = "";
    int x{0};
    int y{0};
    int w{0};
    int h{0};
    bool shown{false};
  };

  void make_key(Key &key, lv_obj_t *parent, Font font) {
    key.font = font;
    key.block = ui::block(parent, theme::KEY);
    key.label = ui::label(key.block, font, theme::INK);
    lv_obj_set_style_text_align(key.label, LV_TEXT_ALIGN_CENTER, 0);
    show_part(key.block, false);
  }

  void set_key(Key &key, Act action, const std::string &text, Style style) {
    key.action = action;
    key.style = style;
    if (action == Act::NONE) {
      key.shown = false;
      show_part(key.block, false);
      return;
    }
    key.shown = true;
    show_part(key.block, true);
    std::snprintf(key.text, sizeof(key.text), "%s", text.c_str());
    ui::set_text(key.label, key.text);
    apply_key_style(key);
  }

  void apply_key_style(Key &key) {
    if (key.style == Style::ACCENT) {
      ui::set_fill(key.block, Tone::NORMAL, theme::ACCENT);
      ui::set_color(key.label, theme::ON_ACCENT);
    } else if (key.style == Style::ALERT) {
      ui::set_fill(key.block, Tone::ALERT, theme::KEY);
      ui::set_color(key.label, theme::ON_ACCENT);
    } else {
      ui::set_fill(key.block, Tone::NORMAL, theme::KEY);
      ui::set_color(key.label, theme::INK);
    }
  }

  int configure_primary(const char *phase) {
    for (auto &key : keys_) set_key(key, Act::NONE, "", Style::NEUTRAL);
    if (phase_is(phase, "ringing")) {
      set_key(keys_[0], Act::ANSWER, plugin_->text("answer"), Style::ACCENT);
      set_key(keys_[1], Act::DECLINE, plugin_->text("decline"), Style::ALERT);
      return 2;
    }
    if (phase_is(phase, "dialing")) {
      set_key(keys_[0], Act::CANCEL, plugin_->text("cancel"), Style::ALERT);
      return 1;
    }
    if (phase_is(phase, "connected")) {
      set_key(keys_[0], Act::HANGUP, plugin_->text("hangup"), Style::ALERT);
      set_key(keys_[1], Act::TOGGLE_MUTE,
              plugin_->text(plugin_->mic_muted() ? "unmute" : "mute"), Style::NEUTRAL);
      set_key(keys_[2], Act::OPEN_DOOR, plugin_->text("open_door"), Style::NEUTRAL);
      return 3;
    }
    if (phase_is(phase, "idle")) {
      set_key(keys_[0], Act::CALL_TARGET,
              tessera::fill(plugin_->text("call_target"), "number", plugin_->target()), Style::ACCENT);
      set_key(keys_[1], Act::CALL_STATION,
              tessera::fill(plugin_->text("call_station"), "number", plugin_->station()), Style::ACCENT);
      return 2;
    }
    if (phase_is(phase, "error") || phase_is(phase, "offline")) {
      set_key(keys_[0], Act::RETRY, plugin_->text("retry"), Style::ACCENT);
      set_key(keys_[1], Act::CALL_TARGET,
              tessera::fill(plugin_->text("call_number"), "number", plugin_->target()), Style::ACCENT);
      return 2;
    }
    return 0;
  }

  void layout() {
    const char *phase = plugin_->phase();
    const Tone tone = tone_for(phase);
    const bool alert = tone == Tone::ALERT;
    char timer[16] = "";
    if (phase_is(phase, "connected") && plugin_->connected_seconds() != 0)
      format_duration(plugin_->connected_seconds(), timer, sizeof(timer));

    ui::set_text(phase_, phase_text(plugin_, phase));
    ui::set_text(peer_, peer_line(plugin_));
    ui::set_text(timer_, timer);
    ui::set_tone(icon_, alert ? Tone::ALERT : Tone::NORMAL, theme::INK);
    ui::set_fill(dot_, tone, theme::MUTED);
    ui::set_color(phase_, theme::INK);
    ui::set_color(peer_, theme::MUTED);
    ui::set_color(timer_, theme::INK);

    const int pad = ui::px(12);
    const int gap = ui::px(8);
    const int icon_h = ui::line_height(Font::ICON);
    const int phase_h = ui::line_height(Font::HEADLINE);
    const int peer_h = ui::line_height(Font::BODY);
    const int timer_h = ui::line_height(Font::TITLE);
    const int dot = ui::mm(3);
    const int header_h = imax(icon_h, imax(phase_h, timer_h));

    lv_obj_set_pos(icon_, pad, pad);
    lv_obj_set_size(icon_, icon_w_, icon_h);
    lv_obj_set_pos(dot_, width_ - pad - dot, pad + (header_h - dot) / 2);
    lv_obj_set_size(dot_, dot, dot);

    const int text_x = pad + icon_w_ + gap;
    int timer_w = timer[0] != '\0' ? ui::text_width(timer, Font::TITLE) : 0;
    timer_w = imin(timer_w, width_ / 3);
    const int text_right = width_ - pad - dot - gap;
    const int phase_w = imax(0, text_right - text_x - (timer_w != 0 ? timer_w + gap : 0));
    lv_obj_set_pos(phase_, text_x, pad + (header_h - phase_h) / 2);
    lv_obj_set_size(phase_, phase_w, phase_h);

    show_part(timer_, timer[0] != '\0');
    if (timer[0] != '\0') {
      lv_obj_set_pos(timer_, text_right - timer_w, pad + (header_h - timer_h) / 2);
      lv_obj_set_size(timer_, timer_w, timer_h);
    }

    const bool has_peer = plugin_->peer()[0] != '\0' &&
                          (phase_is(phase, "ringing") || phase_is(phase, "dialing") ||
                           phase_is(phase, "connected"));
    show_part(peer_, has_peer);
    int header_bottom = pad + header_h;
    if (has_peer) {
      lv_obj_set_pos(peer_, text_x, header_bottom + ui::px(4));
      lv_obj_set_size(peer_, imax(0, width_ - text_x - pad), peer_h);
      header_bottom += ui::px(4) + peer_h;
    }

    const bool with_pad = show_pad_ && phase_is(phase, "connected");
    const int primary_h = imin(ui::mm(14), imax(ui::mm(9), height_ / (with_pad ? 7 : 5)));
    const int count = configure_primary(phase);
    int primary_y;
    if (with_pad) {
      primary_y = header_bottom + gap * 2;
    } else {
      const int free_top = header_bottom + gap;
      const int free_bottom = height_ - pad;
      primary_y = free_top + imax(0, (free_bottom - free_top - primary_h) / 2);
    }
    if (count > 0) {
      const int key_w = (width_ - 2 * pad - (count - 1) * gap) / count;
      for (int i = 0; i < count; ++i) {
        Key &key = keys_[i];
        const int line = ui::line_height(key.font);
        lv_obj_set_pos(key.block, pad + i * (key_w + gap), primary_y);
        lv_obj_set_size(key.block, key_w, primary_h);
        lv_obj_set_pos(key.label, 0, (primary_h - line) / 2);
        lv_obj_set_size(key.label, key_w, line);
        key.x = pad + i * (key_w + gap);
        key.y = primary_y;
        key.w = key_w;
        key.h = primary_h;
      }
    }

    bool pad_visible = false;
    if (with_pad) {
      const int pad_top = primary_y + primary_h + gap * 2;
      const int pad_bottom = height_ - pad;
      const int area = pad_bottom - pad_top;
      const int min_key = ui::mm(9);
      if (area >= 4 * min_key + 3 * gap) {
        const int key_h = imin(ui::mm(20), (area - 3 * gap) / 4);
        const int key_w = (width_ - 2 * pad - 2 * gap) / 3;
        for (int i = 0; i < 12; ++i) {
          Key &key = pad_keys_[i];
          const int col = i % 3;
          const int row = i / 3;
          const int x = pad + col * (key_w + gap);
          const int y = pad_top + row * (key_h + gap);
          const int line = ui::line_height(key.font);
          lv_obj_set_pos(key.block, x, y);
          lv_obj_set_size(key.block, key_w, key_h);
          lv_obj_set_pos(key.label, 0, (key_h - line) / 2);
          lv_obj_set_size(key.label, key_w, line);
          apply_key_style(key);
          show_part(key.block, true);
          key.x = x;
          key.y = y;
          key.w = key_w;
          key.h = key_h;
          key.shown = true;
        }
        pad_visible = true;
      }
    }
    if (!pad_visible) {
      for (auto &key : pad_keys_) {
        key.shown = false;
        show_part(key.block, false);
      }
    }
  }

  static bool inside(const tessera::Point &p, const Key &key) {
    return p.x >= key.x && p.x < key.x + key.w && p.y >= key.y && p.y < key.y + key.h;
  }

  void perform(const Key &key) {
    switch (key.action) {
      case Act::CALL_TARGET:
        plugin_->call(plugin_->target());
        break;
      case Act::CALL_STATION:
        plugin_->call(plugin_->station());
        break;
      case Act::ANSWER:
        plugin_->answer();
        break;
      case Act::DECLINE:
        plugin_->decline();
        break;
      case Act::CANCEL:
      case Act::HANGUP:
        plugin_->hangup();
        break;
      case Act::TOGGLE_MUTE:
        plugin_->toggle_mute();
        layout();
        break;
      case Act::OPEN_DOOR:
        plugin_->send_dtmf("1");
        break;
      case Act::RETRY:
        plugin_->retry();
        break;
      case Act::DTMF: {
        char digit[2] = {key.digit, '\0'};
        plugin_->send_dtmf(digit);
        break;
      }
      case Act::NONE:
        break;
    }
  }

  SipDoorbell *plugin_;
  int width_{0};
  int height_{0};
  int icon_w_{0};
  bool show_pad_{false};

  lv_obj_t *icon_{nullptr};
  lv_obj_t *dot_{nullptr};
  lv_obj_t *phase_{nullptr};
  lv_obj_t *peer_{nullptr};
  lv_obj_t *timer_{nullptr};
  Key keys_[3];
  Key pad_keys_[12];
};

void SipDoorbell::setup() {
  add_tile("door", [this]() { return new DoorTile(this); });
  add_card("call", [this]() { return new CallCard(this); }, true);
}

void SipDoorbell::on_interval(uint32_t now_ms) { sync_ui_(); }

bool SipDoorbell::settings(tessera::SettingsPage &page) {
  page.icon = "\U000F12E6";
  page.toggle(text("setting_auto_answer"), [this] { return auto_answer(); },
              [this](bool on) {
                if (auto_answer_ == nullptr) return;
                if (on) auto_answer_->turn_on(); else auto_answer_->turn_off();
              });
  page.toggle(text("setting_ring_popup"), [this] { return ring_popup(); },
              [this](bool on) {
                if (ring_popup_ == nullptr) return;
                if (on) ring_popup_->turn_on(); else ring_popup_->turn_off();
              });
  return true;
}

const char *SipDoorbell::phase() const {
  if (sip_ == nullptr) return "offline";
  switch (sip_->state()) {
    case sip_client::SIP_IDLE:
      return ever_registered_ ? "error" : "offline";
    case sip_client::SIP_REGISTERING:
      return "registering";
    case sip_client::SIP_REGISTERED:
      return "idle";
    case sip_client::SIP_INVITING:
    case sip_client::SIP_RINGING_OUT:
      return "dialing";
    case sip_client::SIP_INCOMING:
    case sip_client::SIP_ANSWERING:
      return "ringing";
    case sip_client::SIP_IN_CALL:
      return "connected";
    default:
      return "unknown";
  }
}

bool SipDoorbell::registered() const { return sip_ != nullptr && sip_->registered(); }
bool SipDoorbell::mic_muted() const { return sip_ != nullptr && sip_->mic_muted(); }
bool SipDoorbell::ring_popup() const { return ring_popup_ == nullptr || ring_popup_->state; }
bool SipDoorbell::auto_answer() const { return auto_answer_ != nullptr && auto_answer_->state; }

uint32_t SipDoorbell::connected_seconds() const {
  if (connected_ms_ == 0) return 0;
  return (millis() - connected_ms_) / 1000;
}

void SipDoorbell::set_targets(const char *target, const char *station) {
  std::snprintf(target_, sizeof(target_), "%s", target != nullptr ? target : "555");
  std::snprintf(station_, sizeof(station_), "%s", station != nullptr ? station : "8000");
}

void SipDoorbell::on_sip_registered() {
  ever_registered_ = true;
  sync_ui_();
}

void SipDoorbell::on_sip_incoming(const std::string &caller) {
  std::snprintf(peer_, sizeof(peer_), "%s", caller.c_str());
  sync_ui_();
}

void SipDoorbell::on_sip_connected() {
  connected_ms_ = millis();
  sync_ui_();
}

void SipDoorbell::on_sip_ended() {
  connected_ms_ = 0;
  peer_[0] = '\0';
  if (sip_ != nullptr) sip_->set_mic_muted(false);
  sync_ui_();
}

void SipDoorbell::on_sip_dtmf(const std::string &digit) {
  // The panel only sends DTMF for the door; incoming digits need no UI.
}

void SipDoorbell::call(const char *number) {
  if (sip_ == nullptr || number == nullptr || number[0] == '\0') return;
  std::snprintf(peer_, sizeof(peer_), "%s", number);
  sip_->call(number);
  sync_ui_();
}

void SipDoorbell::answer() {
  if (sip_ != nullptr) sip_->answer();
  sync_ui_();
}

void SipDoorbell::decline() {
  if (sip_ != nullptr) sip_->hangup();
  sync_ui_();
}

void SipDoorbell::hangup() {
  if (sip_ != nullptr) sip_->hangup();
  sync_ui_();
}

void SipDoorbell::send_dtmf(const char *digits) {
  if (sip_ != nullptr && digits != nullptr && digits[0] != '\0') sip_->send_dtmf(digits);
}

void SipDoorbell::toggle_mute() {
  if (sip_ != nullptr) sip_->set_mic_muted(!sip_->mic_muted());
  tessera::refresh();
}

void SipDoorbell::retry() {
  if (sip_ != nullptr) sip_->retry_register();
  sync_ui_();
}

void SipDoorbell::sync_ui_() {
  const char *now = phase();
  if (!phase_is(now, "connected")) connected_ms_ = 0;
  if (!phase_is(now, "ringing")) auto_answered_ = false;

  if (!phase_is(now, "ringing") && tessera::popup_shown(this)) tessera::close_popup(this);
  if (!ring_popup() && tessera::popup_shown(this)) tessera::close_popup(this);

  if (!phase_is(now, last_phase_)) {
    if (phase_is(now, "ringing")) {
      if (auto_answer() && sip_ != nullptr) {
        sip_->answer();
        auto_answered_ = true;
      } else if (ring_popup()) {
        tessera::show_popup(this, [this]() { return new RingPopup(this); });
      }
    }
    std::snprintf(last_phase_, sizeof(last_phase_), "%s", now);
    tessera::refresh();
  } else if (phase_is(now, "ringing") && auto_answer() && !auto_answered_ && sip_ != nullptr) {
    sip_->answer();
    auto_answered_ = true;
  }
}

}  // namespace esphome::sip_doorbell
