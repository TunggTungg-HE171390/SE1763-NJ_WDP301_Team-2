import { useEffect } from "react";

export function useBootstrap() {
    useEffect(() => {
        const bootstrapCSS = document.createElement("link");
        bootstrapCSS.rel = "stylesheet";
        bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css";
        bootstrapCSS.id = "bootstrap-css"; // Set an ID to remove later
        document.head.appendChild(bootstrapCSS);

        return () => {
            document.getElementById("bootstrap-css")?.remove(); // Remove Bootstrap when leaving the page
        };
    }, []);
}
