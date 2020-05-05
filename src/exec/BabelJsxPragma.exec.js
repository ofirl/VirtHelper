function createJsxElement(tagName, attrs = {}, ...children) { // eslint-disable-line no-unused-vars
    if (tagName === 'fragment')
        return children;

    let elem = document.createElement(tagName);
    for (const attrKey in attrs) {
        if (!elem.hasOwnProperty(attrKey) && attrKey !== 'className') // eslint-disable-line no-prototype-builtins
            elem.setAttribute(attrKey, attrs[attrKey]);
        else
            elem[attrKey] = attrs[attrKey];
    }
    // const elem = Object.assign(element, attrs);
    for (const child of children) {
        if (Array.isArray(child)) elem.append(...child);
        else elem.append(child);
    }
    return elem;
}