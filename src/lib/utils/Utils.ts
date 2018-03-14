export const isNil = (x:any):boolean => x == undefined || x == null;

export const DOMURL = window.URL || (window as any).webkitURL || window;

export const sameOrigin = (url:string):boolean => (new URL(url).origin === window.location.origin);
