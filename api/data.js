const CHURCHES = {
  tchumene: {
    name: "Igreja do Nazareno Tchumene",
    baseUrl: "https://script.google.com/macros/s/AKfycbzG8CAG337lDtKuO95ffPBzqCDz5CffoQeixw-3QFvHsZj9M5hVH-qJIphaTGrV-v5r/exec"
  },
  infulene: {
    name: "Igreja do Nazareno Infulene",
    baseUrl: "https://script.google.com/macros/s/AKfycbzInCudLSIH-UBitAuryj9h_LruM7keVdjSTysdDkeHlEBqNYyd0KANZ83z3b8C6ry5/exec"
  },
  boquisso: {
    name: "Igreja do Nazareno Boquisso",
    baseUrl: "https://script.google.com/macros/s/AKfycbwSCQxgQuGrSYLVv3isoD-YdSZ1y_zENVOBFnuHW9FL8GUXN8rYe3-9zOmApDPsL-dw/exec"
  },
  cmatola: {
    name: "Igreja do Nazareno Cidade da Matola",
    baseUrl: "https://script.google.com/macros/s/AKfycbzp_oe8MFAwiDAekiTj-9q5Ji0zzGyWLw0n0qm7ro6yzVE_Q89yOG7AOJyvKz2_8QvDOw/exec"
  }
};

const ALLOWED_TABS = new Set([
  "plano",
  "relatorio",
  "visitantes",
  "financeiro",
  "dizimos"
]);

export default async function handler(req, res) {
  try {
    const church = String(req.query.church || "tchumene").toLowerCase();
    const tab = String(req.query.tab || "").toLowerCase();

    if (!CHURCHES[church]) {
      return res.status(400).json({ error: "Igreja inválida." });
    }

    if (!ALLOWED_TABS.has(tab)) {
      return res.status(400).json({ error: "Tab inválida." });
    }

    const upstreamUrl = `${CHURCHES[church].baseUrl}?tab=${encodeURIComponent(tab)}`;

    const upstreamRes = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    const text = await upstreamRes.text();

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        error: "Falha ao consultar Apps Script.",
        details: text
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "Resposta inválida do Apps Script.",
        details: text
      });
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Erro interno no proxy.",
      details: err.message
    });
  }
}
