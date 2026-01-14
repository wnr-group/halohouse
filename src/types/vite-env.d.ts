/// <reference types="vite/client" />
declare module "*.glb" {
    const src: string;
    export default src;
}

/*A .glb file is just a URL string — allow it.”*/