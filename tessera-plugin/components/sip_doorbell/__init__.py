"""SIP doorbell: the ESPHome side.

The component registers the plugin's tile type. The actual SIP/WebRTC audio is not on the screen: it runs in the
browser card, which writes the phase to Home Assistant and listens to the command helper. This component only draws
the status tile and sends the toggle script and input_text commands.
"""
import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import smart_display, switch
from esphome.const import CONF_ID

DEPENDENCIES = ["smart_display"]

CONF_RING_POPUP = "ring_popup"

sip_doorbell_ns = cg.esphome_ns.namespace("sip_doorbell")
SipDoorbell = sip_doorbell_ns.class_("SipDoorbell", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(SipDoorbell),
        cv.Required(CONF_RING_POPUP): cv.use_id(switch.Switch),
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
    await smart_display.register_plugin(var, __file__)
    cg.add(var.set_ring_popup(await cg.get_variable(config[CONF_RING_POPUP])))
