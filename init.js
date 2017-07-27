/* global client, plugin */
/* global formatException */

// PLUGIN ENVIRONMENT //

plugin.id = 'ctcp-activity';

plugin.init =
function _init(glob) {
    this.major = 1;
    this.minor = 0;
    this.version = this.major + '.' + this.minor + ' (27 Jul 2017)';
    this.description = 'Shows CTCP activity. ' +
    "By James Ross <chatzilla-plugins@james-ross.co.uk>.";

    return 'OK';
}

plugin.enable =
function _enable() {
    client.eventPump.addHook([
        { set: 'server', type: 'ctcp' }
    ],
        plugin.onCTCP,
        plugin.id + '-server-ctcp');
    return true;
}

plugin.disable =
function _disable() {
    client.eventPump.removeHookByName(plugin.id + '-server-ctcp');
    return true;
}

plugin.onCTCP =
function _onctcp(e) {
    try {
        if (e.type != 'ctcp')
            return;

        var ary = e.params[2].match (/^\x01([^ ]+) ?(.*)\x01$/i);
        if (ary == null)
            return;

        var code = ary[1].toLowerCase();
        if (code.indexOf('reply') === 0 || code === 'action')
            return;

        code = toUnicode(code, e.replyTo);
        data = toUnicode(ary[2] || '', e.replyTo);

        e.server.parent.display('CTCP "' + code + '" of "' + data + '" from "' + e.user.unicodeName + '"', 'INFO', e.user || e.server.parent, e.channel || e.server.me);
    } catch (ex) {
        client.display('CTCP Activity: ' + formatException(ex));
    }
}
