export const isNil = (x:any):boolean => x == undefined || x == null;

export const getDomUrl = (url:string) => {
    const ctor = window.URL || (window as any).webkitURL || window;
    return new ctor(url);
}

export const sameOrigin = (url:string):boolean => 
    url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1
        ?   (getDomUrl(url).origin === window.location.origin)
        :   true;
