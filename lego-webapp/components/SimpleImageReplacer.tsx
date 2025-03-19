import React, { useEffect, useState, useRef } from 'react';

const SimpleImageReplacer = () => {
    const [isClient, setIsClient] = useState(false);
    const observerRef = useRef<MutationObserver | null>(null);

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
        'https://media1.tenor.com/m/RR-8CBT-yb4AAAAd/plane-memes.gif'
    ];

    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * predefinedImages.length);
        return predefinedImages[randomIndex];
    };

    const shouldSkipImage = (img: HTMLImageElement) => {
        if (img.dataset.noReplace === 'true') return true;

        if (img.classList.contains('logo') || img.classList.contains('no-replace')) return true;

        const src = img.src.toLowerCase();
        if (src.includes('logo') || src.includes('brand') || src.includes('header-icon')) return true;

        const parent = img.closest('header, .navbar, .navigation');
        if (parent) return true;

        return false;
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Function to replace all images with random ones
        const replaceAllImages = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (shouldSkipImage(img)) return;

                if (!img.dataset.originalSrc) {
                    img.dataset.originalSrc = img.src;
                    img.dataset.originalWidth = img.width ? img.width + 'px' : img.style.width;
                    img.dataset.originalHeight = img.height ? img.height + 'px' : img.style.height;
                }

                img.src = getRandomImage();

                if (img.dataset.originalWidth) img.style.width = img.dataset.originalWidth;
                if (img.dataset.originalHeight) img.style.height = img.dataset.originalHeight;
            });
        };

        // Initial image replacement
        replaceAllImages();

        // Setup mutation observer to detect and replace new images
        if (!observerRef.current) {
            observerRef.current = new MutationObserver(mutations => {
                let hasNewImages = false;

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLImageElement) {
                            hasNewImages = true;
                        } else if (node instanceof Element && node.querySelectorAll('img').length > 0) {
                            hasNewImages = true;
                        }
                    });
                });

                if (hasNewImages) {
                    replaceAllImages();
                }
            });

            observerRef.current.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Handle route changes (for SPA navigation)
        const handleRouteChange = () => {
            setTimeout(replaceAllImages, 100);
        };

        window.addEventListener('popstate', handleRouteChange);

        // Clean up function
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [isClient]);

    return null; // No UI, just background functionality
};

export default SimpleImageReplacer;