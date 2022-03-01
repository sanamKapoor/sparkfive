// const isImage = require('is-image');

export const isImageType =  (extension) => {
    // console.log(`isImage: ${isImage(name)}`)
   // return isImage(name)
    return ["png", "jpg", "tiff", "jpeg", "gif", "svg"].includes(extension)
}