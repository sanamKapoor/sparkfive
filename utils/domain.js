export const getSubdomain = () => {
    const currentHostUrl = new URL(process.env.CLIENT_BASE_URL);
    const subdomain = window.location.hostname.split(`.${currentHostUrl.hostname}`)
    // No subdomain
    if(currentHostUrl.hostname === subdomain[0]){
        return null
    }else{
        return subdomain[0]
    }
}
