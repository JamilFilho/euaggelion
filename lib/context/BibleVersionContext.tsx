"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface BibleVersionContextType {
  currentVersion: string | null;
  setCurrentVersion: (versionId: string | null) => void;
  versions: { id: string; name: string }[];
}

const BibleVersionContext = createContext<BibleVersionContextType | undefined>(undefined);

export function BibleVersionProvider({ children, versions }: { children: ReactNode; versions: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract version from the URL path
    const pathSegments = pathname.split("/");
    const versionIndex = pathSegments.indexOf("biblia");
    const versionFromUrl = versionIndex !== -1 ? pathSegments[versionIndex + 1] : null;
    
    // Extract version from query parameters
    const versionFromQuery = searchParams.get("version");
    
    // Only set the version from URL if it exists; otherwise, use query params, localStorage, or default
    if (versionFromUrl && versionFromUrl !== currentVersion) {
      setCurrentVersion(versionFromUrl);
      localStorage.setItem("bibleVersion", versionFromUrl);
    } else if (versionFromQuery && versionFromQuery !== currentVersion) {
      setCurrentVersion(versionFromQuery);
      localStorage.setItem("bibleVersion", versionFromQuery);
    } else if (currentVersion === null) {
      // Try to get the version from localStorage, or default to NVT
      const storedVersion = localStorage.getItem("bibleVersion");
      const defaultVersion = storedVersion || "nvt";
      setCurrentVersion(defaultVersion);
      
      // If we are at /biblia without a version, we might want to redirect or just set the state
      if (pathname === "/biblia" && !versionFromQuery) {
        // Optional: router.push(`/biblia?version=${defaultVersion}`);
      }
    }
  }, [pathname, searchParams, currentVersion]);

  const handleVersionChange = (versionId: string | null) => {
    if (!versionId) return;
    
    // Store the version in localStorage
    localStorage.setItem("bibleVersion", versionId);
    
    // Update the current version in the context
    setCurrentVersion(versionId);
  };

  return (
    <BibleVersionContext.Provider value={{ currentVersion, setCurrentVersion: handleVersionChange, versions }}>
      {children}
    </BibleVersionContext.Provider>
  );
}

export function useBibleVersion() {
  const context = useContext(BibleVersionContext);
  if (context === undefined) {
    throw new Error("useBibleVersion must be used within a BibleVersionProvider");
  }
  return context;
}