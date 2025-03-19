import React, { useEffect, useState, useRef } from 'react';

const SimpleImageReplacer = () => {
    const [isClient, setIsClient] = useState(false);
    const observerRef = useRef<MutationObserver | null>(null);
    const lastPathname = useRef<string>('');

    // Add more funny images to the collection
    const predefinedImages = [
        'https://i1.sndcdn.com/artworks-7LCCiOWCfs2z549h-bU5nkA-t500x500.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUPEAvOLXEfYDDVZh4lap6tGKqicyDxgTsmo3ZP9UN5NnS5ggdrHX7dPJ17UC4YA5guvg&usqp=CAU',
        'https://ih1.redbubble.net/image.5567260501.7128/flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
        'https://media.tenor.com/xjMnQ1DlFp8AAAAM/metallica-of-wolf-and-man.gif',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kw2-xJpUXmloQGvnw5UODDL9n2PWkCVV9g&s',
        'https://media.tenor.com/bP9VtMP9HsIAAAAM/eye-of-rah.gif',
        'https://media.tenor.com/7aBA0B5pt9YAAAAM/hamster-playing-intruments.gif',
        'https://b2c-contenthub.com/wp-content/uploads/2022/09/super-dog.webp',
        'https://media.tenor.com/mmXj5AeF2YkAAAAM/sigma.gif',
        'https://media1.tenor.com/m/9nYR6vIKRFQAAAAC/sigma-alpha-wolf.gif',
        'https://media1.giphy.com/media/hQKiGV6MG8WmsHg2yx/200.gif?cid=6c09b9528373n54gu8w1zzimxcnprq4t221if628eec07zjw&ep=v1_gifs_search&rid=200.gif&ct=g',
        'https://media1.tenor.com/m/h704Z6X_TvEAAAAd/tralalelo-tralalala.gif',
        'https://media.tenor.com/8cc2mmUPACoAAAAm/among-us-red-sus.webp',
        'https://media1.tenor.com/m/RR-8CBT-yb4AAAAd/plane-memes.gif',
        'https://media.tenor.com/h-3gJNpc3HgAAAAM/among-us-sus.gif',
        'https://media.tenor.com/MSFT2ZDwQdUAAAAM/yes-chad.gif',
        'https://media.tenor.com/lPQmNwUvvVcAAAAM/dog-smile.gif',
        'https://media.tenor.com/mZZs3O_Fj2MAAAAM/cat-dance.gif'
    ];

    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * predefinedImages.length);
        return predefinedImages[randomIndex];
    };

    // Improved logic to determine which images to skip
    const shouldSkipImage = (img: HTMLImageElement) => {
        // Skip images explicitly marked to be preserved
        if (img.dataset.noReplace === 'true') return true;
        
        // Skip logos and specific images by class
        if (img.classList.contains('logo') || img.classList.contains('no-replace')) return true;
        
        // Skip images in header/navigation areas by checking src or ID
        const src = img.src.toLowerCase();
        if (
            src.includes('logo') || 
            src.includes('brand') || 
            src.includes('header-icon') ||
            src.includes('favicon')
        ) return true;
        
        const id = img.id.toLowerCase();
        if (id.includes('logo') || id.includes('header') || id.includes('nav')) return true;
        
        // Skip images in header/navigation by parent element
        const header = img.closest('header, .navbar, .navigation, nav, .top-bar, .site-header');
        if (header) return true;
        
        // Also check if image is very small (likely an icon or UI element)
        if (img.width > 0 && img.width < 20 && img.height > 0 && img.height < 20) return true;
        
        return false;
    };

    // Replace all images with random funny images
    const replaceAllImages = () => {
        console.log('🔄 Replacing all images with random ones...');
        
        // Get ALL images in the document
        const allImages = document.querySelectorAll('img');
        console.log(`📸 Found ${allImages.length} images on the page`);
        
        let replacedCount = 0;
        
        allImages.forEach(img => {
            if (shouldSkipImage(img)) {
                return;
            }
            
            // Save original source and dimensions if not already saved
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
                img.dataset.originalWidth = img.width ? img.width + 'px' : img.style.width;
                img.dataset.originalHeight = img.height ? img.height + 'px' : img.style.height;
            }
            
            // Assign a new random image
            img.src = getRandomImage();
            replacedCount++;
            
            // Maintain original dimensions when possible
            if (img.dataset.originalWidth) img.style.width = img.dataset.originalWidth;
            if (img.dataset.originalHeight) img.style.height = img.dataset.originalHeight;
        });
        
        console.log(`✅ Replaced ${replacedCount} images with funny ones`);
    };

    // Detect route changes more effectively
    const detectRouteChange = () => {
        if (typeof window === 'undefined') return;
        
        const currentPathname = window.location.pathname;
        if (currentPathname !== lastPathname.current) {
            console.log(`🔄 Route changed from ${lastPathname.current} to ${currentPathname}`);
            lastPathname.current = currentPathname;
            
            // Wait for the DOM to update with new content
            setTimeout(() => {
                replaceAllImages();
            }, 300);
        }
    };

    // Initial setup
    useEffect(() => {
        setIsClient(true);
        
        if (typeof window !== 'undefined') {
            lastPathname.current = window.location.pathname;
            console.log('🚀 SimpleImageReplacer mounted');
        }
    }, []);

    // Main effect for setting up image replacement
    useEffect(() => {
        if (!isClient) return;
        
        console.log('🔧 Setting up image replacer...');
        
        // Initial replacement with a delay to ensure DOM is loaded
        const initialTimer = setTimeout(() => {
            replaceAllImages();
        }, 500);
        
        // Set up observer for new images
        if (!observerRef.current) {
            observerRef.current = new MutationObserver(mutations => {
                let hasNewImages = false;
                
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLImageElement) {
                            // Direct image node added
                            if (!shouldSkipImage(node)) {
                                if (!node.dataset.originalSrc) {
                                    node.dataset.originalSrc = node.src;
                                }
                                node.src = getRandomImage();
                                hasNewImages = true;
                            }
                        } else if (node instanceof Element) {
                            // Check for images within added elements
                            const newImages = node.querySelectorAll('img');
                            if (newImages.length > 0) {
                                hasNewImages = true;
                                newImages.forEach(img => {
                                    if (!shouldSkipImage(img)) {
                                        if (!img.dataset.originalSrc) {
                                            img.dataset.originalSrc = img.src;
                                        }
                                        img.src = getRandomImage();
                                    }
                                });
                            }
                        }
                    });
                    
                    // Also check for modified attributes on existing images
                    if (mutation.type === 'attributes' && 
                        mutation.target instanceof HTMLImageElement &&
                        mutation.attributeName === 'src') {
                        
                        const img = mutation.target;
                        if (!shouldSkipImage(img) && img.dataset.originalSrc && 
                            img.src !== img.dataset.originalSrc && 
                            !predefinedImages.includes(img.src)) {
                            
                            img.src = getRandomImage();
                            hasNewImages = true;
                        }
                    }
                });
                
                if (hasNewImages) {
                    console.log('🔎 Observer detected new images');
                }
            });
            
            observerRef.current.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src']
            });
            
            console.log('👀 Observer set up for image detection');
        }
        
        // Set up multiple ways to detect route changes
        
        // 1. popstate event (browser back/forward)
        const handlePopState = () => {
            console.log('◀️ popstate event detected');
            setTimeout(replaceAllImages, 300);
        };
        window.addEventListener('popstate', handlePopState);
        
        // 2. Regular interval check for SPA navigation
        const routeCheckInterval = setInterval(detectRouteChange, 1000);
        
        // 3. Click listener (for link clicks)
        const handleClick = (e: MouseEvent) => {
            // Wait a bit after clicks to see if navigation happens
            setTimeout(detectRouteChange, 300);
        };
        document.addEventListener('click', handleClick);
        
        // 4. History API override for pushState and replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            console.log('🔄 history.pushState detected');
            setTimeout(replaceAllImages, 300);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            console.log('🔄 history.replaceState detected');
            setTimeout(replaceAllImages, 300);
        };
        
        // 5. Periodic check for all images
        const periodicReplaceInterval = setInterval(() => {
            replaceAllImages();
        }, 5000);
        
        // Clean up everything when component unmounts
        return () => {
            clearTimeout(initialTimer);
            clearInterval(periodicReplaceInterval);
            clearInterval(routeCheckInterval);
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('click', handleClick);
            
            // Restore original History methods
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
                console.log('❌ Observer disconnected');
            }
        };
    }, [isClient]);

    // This component doesn't render anything visible
    return null;
};

export default SimpleImageReplacer;