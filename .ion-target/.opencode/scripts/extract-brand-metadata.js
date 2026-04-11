(() => {
  const MAX_ELEMENTS = 5000;

  function rgbToHex(r, g, b) {
    const toHex = (n) => {
      const hex = Number(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  function normalizeColor(colorStr) {
    if (!colorStr) return null;

    colorStr = colorStr.trim().toLowerCase();
    if (colorStr === 'transparent' || colorStr === 'none') return null;

    const rgbMatch = colorStr.match(
      /rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)(?:\s*,\s*([0-9.]+))?\s*\)/
    );
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
      if (a === 0) return null;
      return rgbToHex(r, g, b);
    }

    const hexMatch = colorStr.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      let hex = colorStr.toLowerCase();
      if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      return hex;
    }

    return colorStr;
  }

  function normalizeFontWeight(weight) {
    if (!weight) return null;
    weight = weight.toString().trim().toLowerCase();
    if (weight === 'normal') return '400';
    if (weight === 'bold') return '700';
    return weight;
  }

  function incrementCount(map, key) {
    if (!key) return;
    if (!map[key]) map[key] = 0;
    map[key]++;
  }

  function sortedEntries(map, limit) {
    return Object.entries(map)
      .filter(([value]) => !!value)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([value, count]) => ({ value, count }));
  }

  function isButton(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'button') return true;

    if (tag === 'input') {
      const type = (el.getAttribute('type') || '').toLowerCase();
      if (['button', 'submit', 'reset'].includes(type)) return true;
    }

    const role = (el.getAttribute('role') || '').toLowerCase();
    if (role === 'button') return true;

    return false;
  }

  function isLink(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'a' && el.hasAttribute('href')) return true;
    return false;
  }

  const textColorCounts = {};
  const backgroundColorCounts = {};
  const borderColorCounts = {};

  const buttonTextColorCounts = {};
  const buttonBackgroundColorCounts = {};
  const buttonBorderColorCounts = {};

  const linkColorCounts = {};

  const fontFamilyCounts = {};
  const fontWeightCounts = {};

  const borderRadiusCounts = {};
  const boxShadowCounts = {};
  const opacityCounts = {};
  const gradientCounts = {};

  const hoverTextColorCounts = {};
  const hoverBackgroundColorCounts = {};
  const hoverBorderColorCounts = {};
  const hoverBoxShadowCounts = {};
  const hoverGradientCounts = {};

  const allElements = Array.from(document.querySelectorAll('*')).slice(0, MAX_ELEMENTS);

  for (const el of allElements) {
    const style = window.getComputedStyle(el);

    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      parseFloat(style.opacity || '1') === 0
    ) {
      continue;
    }

    const textColor = normalizeColor(style.color);
    incrementCount(textColorCounts, textColor);

    const bgColor = normalizeColor(style.backgroundColor);
    incrementCount(backgroundColorCounts, bgColor);

    const borderSides = ['Top', 'Right', 'Bottom', 'Left'];
    for (const side of borderSides) {
      const width = parseFloat(style['border' + side + 'Width'] || '0');
      const bStyle = style['border' + side + 'Style'] || 'none';
      if (width > 0 && bStyle !== 'none') {
        const bColor = normalizeColor(style['border' + side + 'Color']);
        incrementCount(borderColorCounts, bColor);
      }
    }

    const fontFamily = (style.fontFamily || '').trim();
    if (fontFamily) {
      incrementCount(fontFamilyCounts, fontFamily);
    }

    const fontWeight = normalizeFontWeight(style.fontWeight);
    if (fontWeight) {
      incrementCount(fontWeightCounts, fontWeight);
    }

    const borderRadius = (style.borderRadius || '').trim();
    if (borderRadius && borderRadius !== '0px' && borderRadius !== '0') {
      incrementCount(borderRadiusCounts, borderRadius);
    }

    const boxShadow = (style.boxShadow || '').trim();
    if (boxShadow && boxShadow !== 'none') {
      incrementCount(boxShadowCounts, boxShadow);
    }

    const opacity = style.opacity;
    if (opacity && opacity !== '1') {
      incrementCount(opacityCounts, opacity);
    }

    const bgImage = (style.backgroundImage || '').trim();
    if (bgImage && bgImage !== 'none' && bgImage.includes('gradient(')) {
      incrementCount(gradientCounts, bgImage);
    }

    if (isButton(el)) {
      const btnTextColor = textColor;
      const btnBgColor = bgColor;

      incrementCount(buttonTextColorCounts, btnTextColor);
      incrementCount(buttonBackgroundColorCounts, btnBgColor);

      for (const side of borderSides) {
        const width = parseFloat(style['border' + side + 'Width'] || '0');
        const bStyle = style['border' + side + 'Style'] || 'none';
        if (width > 0 && bStyle !== 'none') {
          const bColor = normalizeColor(style['border' + side + 'Color']);
          incrementCount(buttonBorderColorCounts, bColor);
        }
      }
    }

    if (isLink(el)) {
      const linkColor = textColor;
      incrementCount(linkColorCounts, linkColor);
    }
  }

  // Collect hover styles from stylesheets
  try {
    const styleSheets = document.styleSheets;
    for (let sheetIdx = 0; sheetIdx < styleSheets.length; sheetIdx++) {
      const sheet = styleSheets[sheetIdx];
      let rules;
      try {
        const cssRules = sheet.cssRules;
        if (!cssRules) continue;
        rules = cssRules;
      } catch (e) {
        continue;
      }

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.type !== 1) continue;
        if (!rule.selectorText || !rule.style) continue;
        if (!rule.selectorText.includes(':hover')) continue;

        const s = rule.style;

        const hColor = normalizeColor(s.color);
        incrementCount(hoverTextColorCounts, hColor);

        const hBg = normalizeColor(s.backgroundColor);
        incrementCount(hoverBackgroundColorCounts, hBg);

        const hBorderColor = normalizeColor(s.borderColor);
        incrementCount(hoverBorderColorCounts, hBorderColor);

        const hBoxShadow = (s.boxShadow || '').trim();
        if (hBoxShadow && hBoxShadow !== 'none') {
          incrementCount(hoverBoxShadowCounts, hBoxShadow);
        }

        const hBgImage = (s.backgroundImage || '').trim();
        if (hBgImage && hBgImage !== 'none' && hBgImage.includes('gradient(')) {
          incrementCount(hoverGradientCounts, hBgImage);
        }
      }
    }
  } catch (e) {
    // Ignore errors accessing stylesheets
  }

  // Image extraction
  const extractImages = () => {
    const images = [];
    const seen = new Set();

    const addImage = (src, alt, width, height, context) => {
      if (!src || seen.has(src)) return;
      if (src.startsWith('data:') && src.length > 1000) return;
      seen.add(src);

      const srcLower = src.toLowerCase();
      const altLower = alt.toLowerCase();
      const isLogo =
        srcLower.includes('logo') ||
        altLower.includes('logo') ||
        context.includes('logo');

      images.push({ src, alt, width, height, isLogo, context });
    };

    // 1. All <img> elements
    const imgElements = document.querySelectorAll('img');
    for (const img of imgElements) {
      const src = img.src ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src') ||
        img.getAttribute('data-original') ||
        (img.getAttribute('srcset') ? img.getAttribute('srcset').split(',')[0].trim().split(' ')[0] : null);

      if (!src) continue;

      const rect = img.getBoundingClientRect();
      const classStr = (img.className || '').toLowerCase();
      const idStr = (img.id || '').toLowerCase();
      const parentTag = img.parentElement ? img.parentElement.tagName.toLowerCase() : '';
      const parentClass = img.parentElement ? (img.parentElement.className || '').toString().split(' ')[0] : '';

      let context = 'img';
      if (classStr.includes('logo') || idStr.includes('logo')) context = 'img:logo';
      else if (classStr.includes('hero') || parentClass.includes('hero')) context = 'img:hero';
      else if (classStr.includes('avatar') || idStr.includes('avatar')) context = 'img:avatar';
      else context = 'img:' + parentTag + (parentClass ? '.' + parentClass : '');

      addImage(src, img.alt || '', Math.round(rect.width), Math.round(rect.height), context);
    }

    // 2. Favicons
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="mask-icon"]',
      'link[rel="fluid-icon"]',
    ];
    for (const selector of faviconSelectors) {
      const links = document.querySelectorAll(selector);
      for (const link of links) {
        const href = link.getAttribute('href');
        if (href) {
          const sizes = link.getAttribute('sizes') || '32x32';
          const parts = sizes.split('x');
          const w = parseInt(parts[0]) || 32;
          const h = parseInt(parts[1]) || 32;
          addImage(href, 'favicon', w, h, 'favicon:' + link.getAttribute('rel'));
        }
      }
    }

    // 3. Open Graph images
    const ogImageMetas = document.querySelectorAll('meta[property="og:image"], meta[property="og:image:url"]');
    for (const meta of ogImageMetas) {
      const content = meta.getAttribute('content');
      if (content) {
        const widthMeta = document.querySelector('meta[property="og:image:width"]');
        const heightMeta = document.querySelector('meta[property="og:image:height"]');
        const w = parseInt(widthMeta ? widthMeta.getAttribute('content') : '1200') || 1200;
        const h = parseInt(heightMeta ? heightMeta.getAttribute('content') : '630') || 630;
        addImage(content, 'Open Graph image', w, h, 'meta:og:image');
      }
    }

    // 4. Twitter Card images
    const twitterImageMetas = document.querySelectorAll('meta[name="twitter:image"], meta[property="twitter:image"]');
    for (const meta of twitterImageMetas) {
      const content = meta.getAttribute('content');
      if (content) {
        addImage(content, 'Twitter Card image', 1200, 600, 'meta:twitter:image');
      }
    }

    // 5. Schema.org / JSON-LD images
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent || '{}');
        const extractFromSchema = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          if (obj.logo) {
            const logoUrl = typeof obj.logo === 'string' ? obj.logo : obj.logo.url;
            if (logoUrl) addImage(logoUrl, 'Schema.org logo', 200, 60, 'schema:logo');
          }
          if (obj.image) {
            const imgUrl = typeof obj.image === 'string' ? obj.image : (Array.isArray(obj.image) ? obj.image[0] : (obj.image ? obj.image.url : null));
            if (imgUrl) addImage(imgUrl, 'Schema.org image', 800, 600, 'schema:image');
          }
          if (Array.isArray(obj)) obj.forEach(extractFromSchema);
          else Object.values(obj).forEach(extractFromSchema);
        };
        extractFromSchema(data);
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    // 6. <picture> and <source> elements
    const sources = document.querySelectorAll('picture source, video source');
    for (const source of sources) {
      const srcset = source.getAttribute('srcset');
      if (srcset && (source.getAttribute('type') && source.getAttribute('type').startsWith('image/') || source.parentElement && source.parentElement.tagName === 'PICTURE')) {
        const firstSrc = srcset.split(',')[0].trim().split(' ')[0];
        if (firstSrc) {
          addImage(firstSrc, '', 0, 0, 'source:picture');
        }
      }
    }

    // 7. SVG <image> elements
    const svgImages = document.querySelectorAll('svg image, svg use');
    for (const el of svgImages) {
      const href = el.getAttribute('href') || el.getAttribute('xlink:href');
      if (href && !href.startsWith('#')) {
        addImage(href, 'SVG reference', 0, 0, 'svg:image');
      }
    }

    // 8. Background images
    const bgElements = Array.from(document.querySelectorAll('*')).slice(0, 2000);
    for (const el of bgElements) {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const urlMatches = bgImage.matchAll(/url\(["']?([^"')]+)["']?\)/g);
        for (const match of urlMatches) {
          if (match[1] && !match[1].startsWith('data:')) {
            const rect = el.getBoundingClientRect();
            const tag = el.tagName.toLowerCase();
            const classStr = (el.className || '').toString().split(' ')[0] || '';
            addImage(match[1], '', Math.round(rect.width), Math.round(rect.height), 'bg:' + tag + (classStr ? '.' + classStr : ''));
          }
        }
      }
    }

    // 9. Video poster images
    const videos = document.querySelectorAll('video[poster]');
    for (const video of videos) {
      const poster = video.getAttribute('poster');
      if (poster) {
        const rect = video.getBoundingClientRect();
        addImage(poster, 'Video poster', Math.round(rect.width), Math.round(rect.height), 'video:poster');
      }
    }

    // Sort and limit
    return images.sort((a, b) => {
      if (a.isLogo && !b.isLogo) return -1;
      if (!a.isLogo && b.isLogo) return 1;

      const aFav = a.context.startsWith('favicon');
      const bFav = b.context.startsWith('favicon');
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      const aMeta = a.context.startsWith('meta:');
      const bMeta = b.context.startsWith('meta:');
      if (aMeta && !bMeta) return -1;
      if (!aMeta && bMeta) return 1;

      return (b.width * b.height) - (a.width * a.height);
    }).slice(0, 75);
  };

  return {
    textColors: sortedEntries(textColorCounts, 16),
    backgroundColors: sortedEntries(backgroundColorCounts, 16),
    borderColors: sortedEntries(borderColorCounts, 16),

    buttonTextColors: sortedEntries(buttonTextColorCounts, 12),
    buttonBackgroundColors: sortedEntries(buttonBackgroundColorCounts, 12),
    buttonBorderColors: sortedEntries(buttonBorderColorCounts, 12),

    linkColors: sortedEntries(linkColorCounts, 12),

    fontFamilies: sortedEntries(fontFamilyCounts, 12),
    fontWeights: sortedEntries(fontWeightCounts, 8),

    borderRadii: sortedEntries(borderRadiusCounts, 12),
    boxShadows: sortedEntries(boxShadowCounts, 12),
    opacities: sortedEntries(opacityCounts, 8),
    gradients: sortedEntries(gradientCounts, 12),

    hover: {
      textColors: sortedEntries(hoverTextColorCounts, 12),
      backgroundColors: sortedEntries(hoverBackgroundColorCounts, 12),
      borderColors: sortedEntries(hoverBorderColorCounts, 12),
      boxShadows: sortedEntries(hoverBoxShadowCounts, 12),
      gradients: sortedEntries(hoverGradientCounts, 12),
    },

    images: extractImages(),
  };
})()