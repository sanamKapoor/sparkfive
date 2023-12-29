import { useContext } from "react";
import { UserContext } from "../context";

const usePageInfo = () => {
  const { user } = useContext(UserContext);

    return {
        url: window.location.href,
        origin: window.location.origin,
        path: window.location.pathname,
        search: window.location.search,
        eventType: "PAGE",
        userId: user?.id || null
    }
}

export default usePageInfo;
