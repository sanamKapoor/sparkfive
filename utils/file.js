// const isImage = require('is-image');

export const isImageType =  (name) => {
    // console.log(`isImage: ${isImage(name)}`)
   // return isImage(name)
    return ["png", "jpg", "tiff", "jpeg", "gif", "svg"].includes(name)
}
