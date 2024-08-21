export const customLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality}`;
};
