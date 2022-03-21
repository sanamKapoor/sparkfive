const copyToClipboard = (url) => {
  if (!navigator.clipboard) {
    return ''
  }

  return navigator.clipboard.writeText(url)
}

export default {
  copyToClipboard
}