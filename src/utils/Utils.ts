export const isNil = (x:any):boolean => x == undefined || x == null;

export const DOMURL = window.URL || (window as any).webkitURL || window;

export const sameOrigin = (url:string):boolean => 
    url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1
        ?   (new URL(url).origin === window.location.origin)
        :   true;
