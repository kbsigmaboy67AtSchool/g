(() => {
  const s = document.currentScript;

  if (!s) {
    alert("g.js error: <script> tag not detected.");
    return;
  }

  const rawUrl = s.getAttribute("url");
  const title  = s.getAttribute("title") || "Web App";
  const image  = s.getAttribute("image") || "";

  // ---- HELP MESSAGE ----
  if (!rawUrl) {
    alert(
`g.js usage:

You must provide a "url" attribute.

Supported URL types:
• Normal URL
• Base64-encoded URL
• data: URL

Optional:
• title="Tab Name"
• image="Favicon URL"

Example:

<script
  src="https://kbsigmaboy67AtSchool.github.io/g/.js"
  url="aHR0cHM6Ly9leGFtcGxlLmNvbQ=="
  title="My App"
  image="https://example.com/icon.png"
  async>
</script>

What g.js does:
• Loads your URL inside a full-page iframe
• Opens it via a Blob page
• Replaces history entry (clean back button behavior)`
    );
    return;
  }

  // ---- URL RESOLUTION ----
  function resolveUrl(input) {
    input = input.trim();

    // data URL
    if (input.startsWith("data:")) return input;

    // base64 URL
    try {
      const decoded = atob(input);
      if (
        decoded.startsWith("http://") ||
        decoded.startsWith("https://") ||
        decoded.startsWith("data:")
      ) {
        return decoded;
      }
    } catch {}

    // normal URL
    return input;
  }

  const finalUrl = resolveUrl(rawUrl);

  // ---- BLOB PAGE ----
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  ${image ? `<link rel="icon" href="${image}">` : ""}
  <style>
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>
<body>
  <iframe src="${finalUrl}" referrerpolicy="no-referrer"></iframe>

  <script>
    // basic SPA-style history stabilization
    history.replaceState({}, "", "/app");
    window.addEventListener("popstate", () => {
      history.pushState({}, "", "/app");
    });
  <\/script>
</body>
</html>
`;

  const blob = new Blob([html], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);

  window.location.replace(blobUrl);
})();
