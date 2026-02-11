export interface Setting {
  key: string;
  value: string;
  type: string;
  group: string;
}

export interface ApiResponse {
  code: number;
  status: string;
  data: Setting[];
}

export const STORAGE_BASE_URL = 'https://n-tawasull.sa/storage';

/**
 * Helper to construct the full URL for files/images from the API.
 */
export const getFileUrl = (path: string | null | undefined, fallback: string = ''): string => {
    if (!path) return fallback;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    // Ensure clean concatenation
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const cleanBase = STORAGE_BASE_URL.endsWith('/') ? STORAGE_BASE_URL.substring(0, STORAGE_BASE_URL.length - 1) : STORAGE_BASE_URL;
    
    return `${cleanBase}/${cleanPath}`;
};

/**
 * Fetches settings from the API.
 * Implements robust error handling to manage CORS or network failures.
 * If the fetch fails, it returns an empty object so the app can use local defaults.
 */
export const fetchSettings = async (): Promise<Record<string, any>> => {
  const SETTINGS_URL = 'https://n-tawasull.sa/api/settings';
  
  try {
    // Add a controller to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(SETTINGS_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        // If server returns an error code, we log it quietly and move to fallbacks
        console.warn(`Settings API returned status: ${response.status}`);
        return {};
    }
    
    const json: ApiResponse = await response.json();
    const settings: Record<string, any> = {};
    
    if (json.data && Array.isArray(json.data)) {
        json.data.forEach(item => {
            let parsedValue: any = item.value;

            // Parse JSON values if the type suggests it or if it looks like a JSON string
            if (item.type === 'json' || (typeof item.value === 'string' && (item.value.trim().startsWith('[') || item.value.trim().startsWith('{')))) {
                try {
                    parsedValue = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                } catch (e) {
                    parsedValue = item.value;
                }
            } else if (item.type === 'boolean') {
                parsedValue = item.value === '1' || item.value === 'true' || (item.value as any) === true;
            } else if (item.type === 'number' || item.type === 'integer') {
                parsedValue = Number(item.value);
            }

            settings[item.key] = parsedValue;
        });
    }

    return settings;
  } catch (error) {
    // We log a warning instead of an error to indicate a handled fallback
    // This usually happens due to CORS or the API being offline.
    console.warn('Settings fetch failed. Using local fallback data. Reason:', error instanceof Error ? error.message : 'Unknown network error');
    return {};
  }
};