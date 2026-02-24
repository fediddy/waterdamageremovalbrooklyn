export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const domain = "waterdamageremovalbrooklyn.com";
    const pagesDomain = "waterdamageremovalbrooklyn.pages.dev";

    // Determine which folder to serve
    let folder = "corporate"; // default: root domain / pages.dev
    if (hostname.endsWith(`.${domain}`) && hostname \!== `www.${domain}`) {
      folder = hostname.replace(`.${domain}`, "");
    } else if (hostname.endsWith(`.${pagesDomain}`)) {
      // Preview deployments on pages.dev — serve corporate
      folder = "corporate";
    }

    // Build the asset path
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    if (\!path.includes(".")) {
      path = path.endsWith("/") ? path + "index.html" : path + ".html";
    }

    // Try exact path first, then with /index.html for directories
    const attempts = [`/${folder}${path}`];
    if (\!path.endsWith(".html")) {
      attempts.push(`/${folder}${path}/index.html`);
    }

    for (const assetPath of attempts) {
      try {
        const assetUrl = new URL(assetPath, url.origin);
        const response = await env.ASSETS.fetch(new Request(assetUrl, request));
        if (response.status === 200) {
          const headers = new Headers(response.headers);
          if (assetPath.endsWith(".html")) headers.set("Content-Type", "text/html; charset=utf-8");
          else if (assetPath.endsWith(".css")) headers.set("Content-Type", "text/css; charset=utf-8");
          else if (assetPath.endsWith(".js")) headers.set("Content-Type", "application/javascript; charset=utf-8");
          else if (assetPath.endsWith(".svg")) headers.set("Content-Type", "image/svg+xml");
          else if (assetPath.endsWith(".xml")) headers.set("Content-Type", "application/xml; charset=utf-8");
          else if (assetPath.endsWith(".png")) headers.set("Content-Type", "image/png");
          else if (assetPath.endsWith(".jpg") || assetPath.endsWith(".jpeg")) headers.set("Content-Type", "image/jpeg");
          else if (assetPath.endsWith(".txt")) headers.set("Content-Type", "text/plain; charset=utf-8");
          return new Response(response.body, { status: 200, headers });
        }
      } catch (e) {}
    }

    // Fallback: 404 page from folder
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
