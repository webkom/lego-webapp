
/**
 * Global image replacer that can be imported directly into the HTML
 * This serves as a backup in case the React component doesn't load
 */

export const initGlobalImageReplacer = () => {
  // Make sure we're in a browser environment
  if (typeof window === 'undefined') return;
  
  const predefinedImages = [
    'https://i1.sndcdn.com/artworks-7LCCiOWCfs2z549h-bU5nkA-t500x500.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUPEAvOLXEfYDDVZh4lap6tGKqicyDxgTsmo3ZP9UN5NnS5ggdrHX7dPJ17UC4YA5guvg&usqp=CAU',
    'https://ih1.redbubble.net/image.5567260501.7128/flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
    'https://media.tenor.com/xjMnQ1DlFp8AAAAM/metallica-of-wolf-and-man.gif',
    'https://media.tenor.com/bP9VtMP9HsIAAAAM/eye-of-rah.gif',
    'https://media1.tenor.com/m/h704Z6X_TvEAAAAd/tralalelo-tralalala.gif',
    'https://media.tenor.com/8cc2mmUPACoAAAAm/among-us-red-sus.webp',
  ];
  
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * predefinedImages.length);
    return predefinedImages[randomIndex];
  };
  
  const shouldSkipImage = (img: HTMLImageElement) => {
    if (img.dataset.noReplace === 'true') return true;
    if (img.classList.contains('logo')) return true;
    
    const src = img.src.toLowerCase();
    if (src.includes('logo') || src.includes('header')) return true;
    
    const header = img.closest('header, nav, .navbar');
    if (header) return true;
    
    return false;
  };
  
  const replaceImages = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (shouldSkipImage(img)) return;
      
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src;
      }
      
      img.src = getRandomImage();
    });
  };
  
  // Replace images immediately
  setTimeout(replaceImages, 500);
  
  // Set up interval to continuously check
  setInterval(replaceImages, 3000);
  
  // Set up a mutation observer
  const observer = new MutationObserver((mutations) => {
    let hasNewImages = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLImageElement || 
            (node instanceof Element && node.querySelectorAll('img').length > 0)) {
          hasNewImages = true;
        }
      });
    });
    
    if (hasNewImages) {
      replaceImages();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('🌎 Global image replacer initialized');
};

// Auto-initialize when this script is loaded directly
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initGlobalImageReplacer();
  });
}