(() => {
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

    // Sort: logos first, then favicons, then meta images, then by area
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

  return { images: extractImages() };
})()