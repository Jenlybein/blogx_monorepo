import { Plugin } from 'vite';

interface VueSourceLocatorOptions {
    allowRoots?: string[];
    attributePrefix?: string;
    endpoint?: string;
    launchEditor?: string;
    overlay?: boolean;
    pathMode?: "absolute" | "relative";
    triggerKey?: "alt" | "shift" | "meta" | "ctrl";
}
declare function vueSourceLocator(options?: VueSourceLocatorOptions): Plugin;

export { type VueSourceLocatorOptions, vueSourceLocator as default };
