import { useRouter } from "next/router";

const usePageInfo = () => {
    const router = useRouter();

    console.log(router);
}

export default usePageInfo;