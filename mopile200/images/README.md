# 📸 Real product photos

The store shows a built-in **vector illustration** for every device. To replace any of
them with a **real photo**, just drop an image file here — it appears automatically, and
if a photo is missing the illustration is used as a fallback (nothing ever breaks).

## ⚖️ Legal note (read this first)
Manufacturer/retailer product photos are **copyrighted**. For an educational project, use:
- your **own** photos, or
- **royalty-free / CC0** images (see sources below), or
- official **press / newsroom** kits that grant reuse.

Don't ship photos you don't have the right to use, especially if the site goes public.

## ✅ How it works
`js/data.js` has `window.MH_IMAGE_BASE = "images/";`
Each product loads:  `images/<category>/<slug>.jpg`

So the file path is the **category folder** + the product **slug** + `.jpg`.

## Method A — drop files in manually
Create the file with the exact name. Categories & a few example filenames:

```
images/
├── smartphones/
│   ├── iphone-15-pro-max.jpg
│   ├── iphone-15.jpg
│   ├── galaxy-s24-ultra.jpg
│   ├── galaxy-a55.jpg
│   ├── honor-magic-6-pro.jpg
│   ├── xiaomi-14-pro.jpg
│   ├── redmi-note-13-pro.jpg
│   ├── pixel-8-pro.jpg
│   ├── oneplus-12.jpg
│   ├── nothing-phone-2.jpg
│   ├── huawei-pura-70-pro.jpg
│   ├── motorola-edge-50-pro.jpg
│   ├── infinix-note-40-pro.jpg
│   ├── nokia-xr21.jpg
│   └── zte-nubia-z60-ultra.jpg   (…and the rest)
├── tablets/        (ipad-pro-13-m4.jpg, galaxy-tab-s9-fe.jpg, xiaomi-pad-6.jpg)
├── smartwatches/   (apple-watch-series-10.jpg, galaxy-watch-7.jpg, huawei-watch-gt-5.jpg)
├── audio/          (airpods-pro-2.jpg, galaxy-buds3-pro.jpg, sony-wh-1000xm5.jpg)
├── laptops/        (macbook-air-13-m3.jpg, galaxy-book4.jpg)
├── accessories/    (apple-20w-adapter.jpg, powerbank-25000.jpg, magnetic-charger.jpg)
└── gaming/         (dualsense-controller.jpg, gaming-triggers.jpg)
```

> The full, exact list of every slug is in `tools/image-sources.json`
> (run `node tools/fetch-images.mjs --init` to regenerate it).

**Tip:** square images (e.g. 800×800) on a white/transparent background look best.

## Method B — download by URL (one command)
1. `node tools/fetch-images.mjs --init` → creates `tools/image-sources.json`.
2. Open it and paste an image URL next to the products you want, e.g.
   ```json
   { "iphone-15-pro-max": "https://example.com/iphone15promax.jpg" }
   ```
3. `node tools/fetch-images.mjs` → downloads each into the right folder/name.

## Override a single product
In `js/data.js`, add an `image` to just one product to point anywhere (local or URL):
```js
{ id: "p1", name: "iPhone 15 Pro Max", image: "images/smartphones/my-photo.jpg", ... }
```

## Turn photos off
Set `window.MH_IMAGE_BASE = "";` in `js/data.js` to use only the illustrations.

## Free / royalty-free sources
- Unsplash — https://unsplash.com  (free license)
- Pexels — https://pexels.com
- Pixabay — https://pixabay.com
- Wikimedia Commons — https://commons.wikimedia.org (check each file's license)
- Manufacturer newsroom/press kits (Apple, Samsung, etc. — follow their reuse terms)
