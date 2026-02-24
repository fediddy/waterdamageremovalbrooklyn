export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const domain = "waterdamageremovalbrooklyn.com";

    // Determine which folder to serve
    let folder = "corporate"; // default: root domain
    if (hostname !== domain && hostname !== `www.${domain}`) {
      // Extract subdomain: "gilbert-az.waterdamageremovalbrooklyn.com" → "gilbert-az"
      folder = hostname.replace(`.${domain}`, "");
    }

    // Build the asset path
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    // If path has no extension, try as directory (append /index.html)
    if (!path.includes(".")) {
      path = path.endsWith("/") ? path + "index.html" : path + "/index.html";
    }

    const assetPath = `/${folder}${path}`;

    try {
      // Fetch from Pages static assets
      const assetUrl = new URL(assetPath, url.origin);
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (response.status === 200) {
        // Set proper content type
        const headers = new Headers(response.headers);
        if (assetPath.endsWith(".html")) headers.set("Content-Type", "text/html; charset=utf-8");
        if (assetPath.endsWith(".css")) headers.set("Content-Type", "text/css; charset=utf-8");
        if (assetPath.endsWith(".js")) headers.set("Content-Type", "application/javascript; charset=utf-8");
        if (assetPath.endsWith(".svg")) headers.set("Content-Type", "image/svg+xml");
        if (assetPath.endsWith(".xml")) headers.set("Content-Type", "application/xml; charset=utf-8");
        return new Response(response.body, { status: 200, headers });
      }
    } catch (e) {}

    // Fallback: try 404.html from the folder
    try {
      const notFoundUrl = new URL(`/${folder}/404.html`, url.origin);
      const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
      if (notFound.status === 200) {
        return new Response(notFound.body, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    } catch (e) {}

    return new Response("Not Found", { status: 404 });
  }
};
