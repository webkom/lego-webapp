
/**
 * Utility to force replace all images on the page
 */
export const replaceAllImagesWithUrl = (imageUrl: string) => {
  console.log(`Replacing all images with: ${imageUrl}`);
  
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Save original source if not already saved
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
    }
    
    // Replace image
    img.src = imageUrl;
  });
  
  console.log(`Replaced ${images.length} images`);
};

export const restoreOriginalImages = () => {
  console.log('Restoring original images');
  
  const images = document.querySelectorAll('img');
  let restoredCount = 0;
  
  images.forEach(img => {
    if (img.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
      restoredCount++;
    }
  });
  
  console.log(`Restored ${restoredCount} images`);
};