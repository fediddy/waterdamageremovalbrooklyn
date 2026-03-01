// Auto-generated — subdomain routing for waterdamageremovalbrooklyn.com

const CITY_DIRS = {
  "aguila-az": true,
  "carefree-az": true,
  "cave-creek-az": true,
  "fountain-hills-az": true,
  "gila-bend-az": true,
  "gilbert-az": true,
  "goodyear-az": true,
  "laveen-az": true,
  "luke-air-force-base-az": true,
  "lukeville-az": true,
  "mount-lemmon-az": true,
  "phoenix-az": true,
  "poston-az": true,
  "queen-creek-az": true,
  "rio-verde-az": true,
  "sasabe-az": true,
  "sells-az": true,
  "tempe-az": true,
  "tucson-az": true,
  "wenden-az": true,
};

const DOMAIN = "waterdamageremovalbrooklyn.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    let folder = "";
    if (hostname.endsWith("." + DOMAIN) && hostname !== "www." + DOMAIN) {
      folder = hostname.replace("." + DOMAIN, "");
    }

    if (!folder) {
      var segments = url.pathname.split("/").filter(Boolean);
      if (segments.length > 0 && CITY_DIRS[segments[0]]) {
        var rest = segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";
        return new Response(null, {
          status: 301,
          headers: { "Location": url.protocol + "//" + segments[0] + "." + DOMAIN + rest + url.search }
        });
      }
      return env.ASSETS.fetch(request);
    }

    if (!CITY_DIRS[folder]) {
      var notFound = await env.ASSETS.fetch(url.origin + "/404.html");
      return new Response(notFound.body, { status: 404, headers: notFound.headers });
    }

    var pathname = url.pathname;
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
    var resp = await env.ASSETS.fetch(url.origin + assetPath);
    if (resp.ok) return resp;

    if (!pathname.endsWith(".html")) {
      resp = await env.ASSETS.fetch(url.origin + "/" + folder + pathname + "/index.html");
      if (resp.ok) return resp;
    }

    var city404 = await env.ASSETS.fetch(url.origin + "/" + folder + "/404.html");
    if (city404.ok) return new Response(city404.body, { status: 404, headers: city404.headers });

    var root404 = await env.ASSETS.fetch(url.origin + "/404.html");
    if (root404.ok) return new Response(root404.body, { status: 404, headers: root404.headers });

    return new Response("Not Found", { status: 404 });
  }
};
