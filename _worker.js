export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const domain = "waterdamageremovalbrooklyn.com";

    let folder = "corporate";
    if (hostname.endsWith("." + domain) && hostname !== "www." + domain) {
      folder = hostname.replace("." + domain, "");
    }

    let pathname = url.pathname;
    if (pathname === "/") {
      pathname = "/index.html";
    } else if (pathname.indexOf(".") === -1) {
      if (pathname.endsWith("/")) {
        pathname = pathname + "index.html";
      } else {
        pathname = pathname + ".html";
      }
    }

    var assetPath = "/" + folder + pathname;
    var newUrl = new URL(url.origin + assetPath);
    var resp = await env.ASSETS.fetch(newUrl.toString());

    if (resp.ok) {
      return resp;
    }

    // Try /index.html variant for directory paths
    if (pathname.endsWith(".html") === false) {
      assetPath = "/" + folder + pathname + "/index.html";
      newUrl = new URL(url.origin + assetPath);
      resp = await env.ASSETS.fetch(newUrl.toString());
      if (resp.ok) {
        return resp;
      }
    }

    // 404 fallback
    var notFoundResp = await env.ASSETS.fetch(url.origin + "/" + folder + "/404.html");
    if (notFoundResp.ok) {
      return new Response(notFoundResp.body, { status: 404, headers: notFoundResp.headers });
    }

    return new Response("Not Found", { status: 404 });
  }
};
