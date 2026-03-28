import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const original = window.fetch;
    window.fetch = async (...args) => {
      const res = await original(...args);
      if (res.status === 401) {
        const url = typeof args[0] === "string" ? args[0] : "";
        if (url.startsWith("/api/")) {
          localStorage.setItem("folio-redirect", window.location.pathname);
          router.push("/login?expired=true");
        }
      }
      return res;
    };
    return () => {
      window.fetch = original;
    };
  }, [router]);
}
