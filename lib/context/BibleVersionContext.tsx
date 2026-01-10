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
    // Extract version from the URL path, but only if it matches a known version id
    const pathSegments = pathname.split("/");
    const versionIndex = pathSegments.indexOf("biblia");
    const potentialVersion = versionIndex !== -1 ? pathSegments[versionIndex + 1] : null;
    const versionFromUrl = potentialVersion && versions.some(v => v.id === potentialVersion) ? potentialVersion : null;
    
    // Extract version from query parameters (validate against known versions)
    const rawVersionFromQuery = searchParams.get("version");
    const versionFromQuery = rawVersionFromQuery && versions.some(v => v.id === rawVersionFromQuery) ? rawVersionFromQuery : null;
    
    // Only set the version from URL if it exists; otherwise, use query params, localStorage, or default
    if (versionFromUrl && versionFromUrl !== currentVersion) {
      setCurrentVersion(versionFromUrl);
      localStorage.setItem("bibleVersion", versionFromUrl);
    } else if (versionFromQuery && versionFromQuery !== currentVersion) {
      setCurrentVersion(versionFromQuery);
      localStorage.setItem("bibleVersion", versionFromQuery);
    } else if (currentVersion === null) {
      // Try to get the version from localStorage, validate it, or default to NVT
      const storedVersion = localStorage.getItem("bibleVersion");
      const storedValid = storedVersion && versions.some(v => v.id === storedVersion) ? storedVersion : null;
      const defaultVersion = storedValid || "nvt";
      setCurrentVersion(defaultVersion);
      
      // If we are at /biblia without a version, we might want to redirect or just set the state
      if (pathname === "/biblia" && !versionFromQuery) {
        // Optional: router.push(`/biblia?version=${defaultVersion}`);
      }
    }
  }, [pathname, searchParams, currentVersion, versions]);

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