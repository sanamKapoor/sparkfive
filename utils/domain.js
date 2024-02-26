export const getSubdomain = () => {
    const currentHostUrl = new URL(process.env.CLIENT_BASE_URL);
    const subdomain = window.location.hostname.replace("www.","").split(`.${currentHostUrl.hostname.replace("www.","")}`)
    // No subdomain
    if(currentHostUrl.hostname.replace("www.","") === subdomain[0]){
        return null
    }else{
        return subdomain[0]
    }
}
