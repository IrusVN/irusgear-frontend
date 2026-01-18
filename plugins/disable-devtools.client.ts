// Plugin to hide Nuxt DevTools toggle button
export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        // Hide DevTools toggle after page loads
        const hideDevTools = () => {
            // Find and remove DevTools elements
            const observer = new MutationObserver(() => {
                // Find elements by various selectors
                const selectors = [
                    '[class*="nuxt-devtools"]',
                    '[id*="nuxt-devtools"]',
                    'button[title*="DevTools"]',
                    '.nuxt-devtools-frame',
                    '.nuxt-devtools-container'
                ];

                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                    });
                });

                // Find elements with shadow root that might contain DevTools
                document.querySelectorAll('*').forEach(el => {
                    if ((el as any).shadowRoot) {
                        const shadow = (el as any).shadowRoot;
                        try {
                            const devToolsInShadow = shadow.querySelectorAll('[class*="devtools"], [id*="devtools"]');
                            devToolsInShadow.forEach((devEl: HTMLElement) => {
                                devEl.style.display = 'none';
                            });
                        } catch (e) {
                            // Closed shadow root, can't access
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        };

        // Run after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hideDevTools);
        } else {
            hideDevTools();
        }
    }
});
