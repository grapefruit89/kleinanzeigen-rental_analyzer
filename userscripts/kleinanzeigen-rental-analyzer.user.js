// ==UserScript==
// @name         Kleinanzeigen Rental Analyzer
// @namespace    https://github.com/example/kleinanzeigen-rental-analyzer
// @version      1.0.0
// @description  Berechnet den Mietpreis pro Quadratmeter auf Angebotsseiten von Kleinanzeigen.de und blendet zusätzliche Hinweise ein.
// @author       rental-analyzer
// @match        https://www.kleinanzeigen.de/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const PRICE_SELECTORS = [
        '[data-testid="ad-price"]',
        '.ad-price',
        '.price-block__price',
        '.price',
        'article [class*="price"]',
    ];

    const AREA_SELECTORS = [
        '[data-testid="ad-living-space"]',
        'dl dd',
        '.details-list__item',
        '[class*="Wohnfläche"]',
    ];

    const INSERTION_TARGET_SELECTORS = [
        '[data-testid="ad-price"]',
        '.ad-price',
        '.price-block',
        '.price',
        'article',
    ];

    const PROCESSED_ATTRIBUTE = 'data-rental-analyzer-enhanced';

    function normalizeText(text) {
        return (text || '')
            .replace(/\s+/g, ' ')
            .replace(/[\u00A0\u2000-\u200D\u202F\u205F\u3000]/g, ' ')
            .trim();
    }

    function parsePrice(rawText) {
        const normalized = normalizeText(rawText)
            .replace(/(zu\s*verschenken|verhandlungsbasis|vb|kostenlos|free)/gi, '')
            .replace(/[^0-9.,]/g, '');
        if (!normalized) {
            return null;
        }
        const parts = normalized.split(/[,.]/);
        if (parts.length > 1) {
            const decimalPart = parts.pop();
            const integerPart = parts.join('');
            return Number(`${integerPart}.${decimalPart}`);
        }
        return Number(normalized);
    }

    function parseArea(rawText) {
        const normalized = normalizeText(rawText)
            .replace(/[^0-9.,]/g, '');
        if (!normalized) {
            return null;
        }
        const parts = normalized.split(/[,.]/);
        if (parts.length > 1) {
            const decimalPart = parts.pop();
            const integerPart = parts.join('');
            return Number(`${integerPart}.${decimalPart}`);
        }
        return Number(normalized);
    }

    function findFirstMatchingElement(selectors, root = document) {
        for (const selector of selectors) {
            const element = root.querySelector(selector);
            if (element) {
                return element;
            }
        }
        return null;
    }

    function extractPrice(root = document) {
        const element = findFirstMatchingElement(PRICE_SELECTORS, root);
        if (!element) {
            return null;
        }
        const price = parsePrice(element.textContent || element.innerText || '');
        return isFinite(price) && price > 0 ? price : null;
    }

    function extractArea(root = document) {
        const candidates = root.querySelectorAll('body *');
        for (const element of candidates) {
            if (element.getAttribute && element.getAttribute(PROCESSED_ATTRIBUTE)) {
                continue;
            }
            const labelText = normalizeText(element.textContent || '');
            if (!labelText) {
                continue;
            }
            if (/wohnfl(ä|ae)che|m²|qm|quadratmeter/i.test(labelText)) {
                const areaValue = parseArea(labelText);
                if (isFinite(areaValue) && areaValue > 0) {
                    element.setAttribute(PROCESSED_ATTRIBUTE, 'true');
                    return areaValue;
                }
            }
        }
        const fallback = findFirstMatchingElement(AREA_SELECTORS, root);
        if (fallback) {
            const area = parseArea(fallback.textContent || fallback.innerText || '');
            if (isFinite(area) && area > 0) {
                fallback.setAttribute(PROCESSED_ATTRIBUTE, 'true');
                return area;
            }
        }
        return null;
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 2,
        }).format(value);
    }

    function insertBadge(text, referenceElement) {
        if (!referenceElement) {
            return;
        }
        const container = document.createElement('div');
        container.textContent = text;
        container.style.backgroundColor = '#0B7285';
        container.style.color = '#FFFFFF';
        container.style.padding = '0.35rem 0.6rem';
        container.style.borderRadius = '0.4rem';
        container.style.fontSize = '0.9rem';
        container.style.display = 'inline-block';
        container.style.marginTop = '0.5rem';
        container.style.fontWeight = '600';
        container.style.boxShadow = '0 2px 8px rgba(11, 114, 133, 0.2)';
        container.setAttribute(PROCESSED_ATTRIBUTE, 'true');

        referenceElement.insertAdjacentElement('afterend', container);
    }

    function enhance(root = document) {
        const price = extractPrice(root);
        const area = extractArea(root);
        if (!price || !area) {
            return;
        }
        const rentPerSqm = price / area;
        const target = findFirstMatchingElement(INSERTION_TARGET_SELECTORS, root) || root.body;
        if (!target || target.querySelector(`[${PROCESSED_ATTRIBUTE}="badge"]`)) {
            return;
        }
        const badgeText = `Miete pro m²: ${formatCurrency(rentPerSqm)} (Preis: ${formatCurrency(price)}, Fläche: ${area.toFixed(2)} m²)`;
        const badge = document.createElement('div');
        badge.textContent = badgeText;
        badge.style.backgroundColor = '#005f73';
        badge.style.color = '#fff';
        badge.style.padding = '0.4rem 0.7rem';
        badge.style.marginTop = '0.5rem';
        badge.style.borderRadius = '0.4rem';
        badge.style.fontWeight = '600';
        badge.style.fontSize = '0.95rem';
        badge.style.boxShadow = '0 2px 8px rgba(0, 95, 115, 0.2)';
        badge.setAttribute(PROCESSED_ATTRIBUTE, 'badge');
        target.insertAdjacentElement('afterend', badge);
    }

    function initialize() {
        enhance();
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            enhance(node);
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target) {
                    enhance(mutation.target);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
        });

        window.addEventListener('locationchange', () => {
            enhance();
        });

        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function (...args) {
            pushState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        history.replaceState = function (...args) {
            replaceState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
