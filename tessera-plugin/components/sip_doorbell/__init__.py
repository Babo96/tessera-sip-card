"""SIP doorbell: the ESPHome side of the native panel endpoint.

The component registers the door tile and the call card. Audio and signaling run on the panel through the vendored
sip_client component; this component draws the UI and calls sip_client directly.
"""
import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.components import smart_display, switch
from esphome.const import CONF_ID

DEPENDENCIES = ["smart_display", "sip_client"]

CONF_SIP_ID = "sip_id"
CONF_RING_POPUP = "ring_popup"
CONF_AUTO_ANSWER = "auto_answer"

sip_doorbell_ns = cg.esphome_ns.namespace("sip_doorbell")
SipDoorbell = sip_doorbell_ns.class_("SipDoorbell", cg.Component)
SipClient = cg.esphome_ns.namespace("sip_client").class_("SipClient", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(SipDoorbell),
        cv.Required(CONF_SIP_ID): cv.use_id(SipClient),
        cv.Required(CONF_RING_POPUP): cv.use_id(switch.Switch),
        cv.Required(CONF_AUTO_ANSWER): cv.use_id(switch.Switch),
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
    await smart_display.register_plugin(var, __file__)
    cg.add(var.set_sip(await cg.get_variable(config[CONF_SIP_ID])))
    cg.add(var.set_ring_popup(await cg.get_variable(config[CONF_RING_POPUP])))
    cg.add(var.set_auto_answer(await cg.get_variable(config[CONF_AUTO_ANSWER])))
