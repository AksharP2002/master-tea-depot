# Master Tea Depot

Official website for **Master Tea Depot** (A Master Products), a tea wholesaler at Gandhi Ganj, Borsad, Gujarat since 1999. The page presents Assam Gold garden-fresh pure CTC tea, a wholesale quotation desk, the depot team, and the shop counter.

## GitHub Pages

Publish as a static site with **no build step**:

1. Repository **Settings → Pages**.
2. **Deploy from a branch**.
3. Branch **`main`**, folder **`/ (root)`**.

`index.html`, `styles.css`, `script.js`, `favicon.svg`, `.nojekyll`, and `assets/` live at the repository root. Links and images use relative paths (`./styles.css`, `./assets/images/...`, `./favicon.svg`), so the same files work at `https://aksharp2002.github.io/master-tea-depot/` and on a custom domain pointed at the Pages site.

`.nojekyll` tells GitHub Pages not to run Jekyll.

## Local preview

From the repository root:

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/`. To mimic the project-site subpath, serve the parent folder so the site is at `/master-tea-depot/`.
