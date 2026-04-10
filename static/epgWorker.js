importScripts('/static/xmlparser/package/lib/fxparser.min.js');
importScripts('/static/xmlparser/package/lib/fxp.min.js');
importScripts('/static/pako/package/dist/pako.min.js');

self.onmessage = async (e) => {
    const { epgUrl } = e.data;
    try {
        const resp = await fetch(epgUrl);
        if (!resp.ok) throw new Error("EPG Error " + resp.status);

        const u8 = new Uint8Array(await resp.arrayBuffer());
        const isGzip = u8[0] === 0x1f && u8[1] === 0x8b;
        const xmlText = isGzip
            ? pako.ungzip(u8, { to: 'string' })
            : new TextDecoder('utf-8').decode(u8);

        if (!fxp || !fxp.XMLParser) throw new Error("fast-xml-parser no disponible");

        const parser = new fxp.XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const xmlObj = parser.parse(xmlText);

        // ── Canals ──────────────────────────────────────────────────────────
        if (xmlObj.tv?.channel) {
            const chArray = Array.isArray(xmlObj.tv.channel)
                ? xmlObj.tv.channel
                : [xmlObj.tv.channel];

            const channels = chArray.map(ch => ({
                id:       ch.id || '',
                name:     Array.isArray(ch["display-name"])
                              ? ch["display-name"][0]
                              : (ch["display-name"] || ''),
                iconSrc:  ch.icon?.src || '',
                category: ch.category || ''
            }));

            postMessage({ type: 'channels', data: channels });
        }

        // ── Programes ────────────────────────────────────────────────────────
        // Enviem TOTS els programes sense filtrar per data.
        // El client farà la conversió de timezone i el filtratge per dia.
        const BATCH_SIZE = 1000;

        if (xmlObj.tv?.programme) {
            const progs = Array.isArray(xmlObj.tv.programme)
                ? xmlObj.tv.programme
                : [xmlObj.tv.programme];

            let batch = [];
            let total = 0;

            for (const p of progs) {
                if (!p.start || !p.stop) continue;

                let title = Array.isArray(p.title) ? p.title[0] : (p.title || '');
                let desc  = Array.isArray(p.desc)  ? p.desc[0]  : (p.desc  || '');

                if (typeof title === 'object' && title !== null) title = title['#text'] || '';
                if (typeof desc  === 'object' && desc  !== null) desc  = desc['#text']  || '';
                title = String(title);
                desc  = String(desc);

                batch.push({
                    channel:     p.channel || '',
                    start:       p.start,   // string XMLTV original (ex: "20240410123000 +0200")
                    stop:        p.stop,    // string XMLTV original
                    title,
                    description: desc,
                    iconSrc:     p.icon?.src   || '',
                    iconSrc2:    p.icon2?.src  || ''
                });
                total++;

                if (batch.length >= BATCH_SIZE) {
                    postMessage({ type: 'programmes', data: batch });
                    batch = [];
                }
            }

            if (batch.length) postMessage({ type: 'programmes', data: batch });
            postMessage({ type: 'stats', total });
        }

        postMessage({ type: 'done' });

    } catch (err) {
        postMessage({ type: 'error', message: err.message });
    }
};