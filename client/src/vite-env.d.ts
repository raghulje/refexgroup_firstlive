/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Declare SVG imports as React components
declare module '*.svg?react' {
    import React = require('react');
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

// Regular SVG imports (as URL strings)
declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.webp' {
    const content: string;
    export default content;
}

