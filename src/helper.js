export const flatten = (arr, depth = 1) =>
    arr.reduce(
        (a, v) =>
            a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
        []
    );

export const deepClone = obj => {
    if (obj === null) return null;
    let clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
        key =>
        (clone[key] =
            typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
    );
    if (Array.isArray(obj)) {
        clone.length = obj.length;
        return Array.from(clone);
    }
    return clone;
};