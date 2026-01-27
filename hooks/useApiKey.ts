import { useState, useEffect, useCallback } from 'react';

const API_KEY_STORAGE_KEY = 'custom_gemini_api_key';

interface UseApiKeyReturn {
    hasApiKey: boolean;
    apiKey: string | null;
    refreshApiKey: () => void;
}

/**
 * Custom hook untuk mengecek ketersediaan API Key
 * API Key bisa berasal dari localStorage (user input) atau environment variable
 */
export const useApiKey = (): UseApiKeyReturn => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);

    const checkApiKey = useCallback(() => {
        if (typeof window === 'undefined') {
            setHasApiKey(false);
            setApiKey(null);
            return;
        }

        // Cek dari localStorage (prioritas utama - user input)
        const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (storedKey && storedKey.trim().length > 10) {
            setApiKey(storedKey);
            setHasApiKey(true);
            return;
        }

        // Cek dari environment variable (build time injection)
        // Note: Ini hanya berfungsi jika env var di-set di Vercel dan di-build ulang
        const envKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)
            ? process.env.GEMINI_API_KEY
            : null;

        if (envKey && envKey !== 'PLACEHOLDER_API_KEY' && envKey.trim().length > 10) {
            setApiKey(envKey);
            setHasApiKey(true);
            return;
        }

        // Tidak ada API Key yang valid
        setApiKey(null);
        setHasApiKey(false);
    }, []);

    useEffect(() => {
        checkApiKey();

        // Listen untuk perubahan localStorage (jika user baru set API Key)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === API_KEY_STORAGE_KEY) {
                checkApiKey();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [checkApiKey]);

    return {
        hasApiKey,
        apiKey,
        refreshApiKey: checkApiKey
    };
};

export default useApiKey;
