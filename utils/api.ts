
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

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  category: string;
  category_id?: number;
  tags: string[];
  main_image: string;
  images: string[];
  display_order?: number;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectVideo {
  type: string;
  provider: string;
  title: string;
  url: string | null;
  iframe: string | null;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  category: string;
  category_id?: number;
  main_image: string;
  images?: string[];
  videos?: ProjectVideo[];
  features?: ProjectFeature[]; 
  content?: string;
  display_order?: number;
}

export const STORAGE_BASE_URL = 'https://n-tawasull.sa/storage';
export const API_BASE_URL = 'https://n-tawasull.sa/api';

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

// --- Professional Caching & Deduplication System ---

// Stores the results of completed requests (Cache)
// Key: unique string identifier (e.g., 'services-page-1'), Value: The data
const dataCache = new Map<string, any>();

// Stores active promises for in-flight requests (Deduplication)
// Key: unique string identifier, Value: The Promise
const activeRequests = new Map<string, Promise<any>>();

/**
 * Generic fetcher with caching and deduplication logic.
 * @param key Unique identifier for the request (e.g., 'services_1')
 * @param url The API endpoint URL
 * @param transformFn Optional function to transform raw JSON to desired format
 */
async function fetchWithCacheAndDedupe<T>(
    key: string, 
    url: string, 
    transformFn: (data: any) => T,
    ttl: number = 300000 // Default cache time: 5 minutes (in ms)
): Promise<T> {
    
    // 1. Check Memory Cache
    if (dataCache.has(key)) {
        // We could check timestamp here for TTL expiration if needed
        return dataCache.get(key) as T;
    }

    // 2. Check In-Flight Requests (Deduplication)
    // If a request for this key is already running, return that promise
    // instead of creating a new network request.
    if (activeRequests.has(key)) {
        return activeRequests.get(key) as Promise<T>;
    }

    // 3. Create New Request
    const requestPromise = (async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // If 404 or other error, return empty/null but don't crash
                console.warn(`API Error [${key}]: ${response.status}`);
                // Return empty array/object based on expected type structure if possible, 
                // but here we might throw or return a safe default handled by the caller.
                // For safety in this app structure, we usually return empty arrays/objects.
                throw new Error(`HTTP Error ${response.status}`);
            }

            const json = await response.json();
            const result = transformFn(json);

            // 4. Save to Cache
            dataCache.set(key, result);
            
            return result;

        } catch (error) {
            console.warn(`Fetch failed for [${key}]:`, error);
            throw error;
        } finally {
            // 5. Cleanup Active Request
            activeRequests.delete(key);
        }
    })();

    activeRequests.set(key, requestPromise);
    
    // Handle errors locally to ensure the promise resolves to a safe fallback if needed,
    // or let the caller handle it. Here we return the promise which might reject.
    return requestPromise;
}

/**
 * Fetches settings from the API.
 */
export const fetchSettings = async (): Promise<Record<string, any>> => {
    return fetchWithCacheAndDedupe(
        'settings',
        `${API_BASE_URL}/settings`,
        (json) => {
            const settings: Record<string, any> = {};
            if (json.data && Array.isArray(json.data)) {
                json.data.forEach((item: any) => {
                    let parsedValue: any = item.value;
                    // Smart type parsing
                    if (item.type === 'json' || (typeof item.value === 'string' && (item.value.trim().startsWith('[') || item.value.trim().startsWith('{')))) {
                        try { parsedValue = typeof item.value === 'string' ? JSON.parse(item.value) : item.value; } catch (e) { parsedValue = item.value; }
                    } else if (item.type === 'boolean') {
                        parsedValue = item.value === '1' || item.value === 'true' || (item.value as any) === true;
                    } else if (item.type === 'number' || item.type === 'integer') {
                        parsedValue = Number(item.value);
                    }
                    settings[item.key] = parsedValue;
                });
            }
            return settings;
        }
    ).catch(() => ({})); // Fallback to empty object on error
};

/**
 * Fetches services from the API with Pagination.
 */
export const fetchServices = async (page: number = 1): Promise<ServiceItem[]> => {
    return fetchWithCacheAndDedupe(
        `services_page_${page}`,
        `${API_BASE_URL}/services?page=${page}`,
        (json) => {
            const dataArray = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
            return dataArray.map((item: any) => {
                let parsedTags: string[] = [];
                if (Array.isArray(item.tags)) {
                    parsedTags = item.tags;
                } else if (typeof item.tags === 'string') {
                    try { parsedTags = JSON.parse(item.tags); } catch { parsedTags = item.tags.split(',').map((t: string) => t.trim()); }
                }

                let parsedImages: string[] = [];
                if (Array.isArray(item.images)) {
                      parsedImages = item.images.map((img: string) => getFileUrl(img));
                }

                return {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category || 'عام',
                    category_id: item.category_id,
                    tags: parsedTags,
                    main_image: getFileUrl(item.main_image),
                    images: parsedImages.length > 0 ? parsedImages : [getFileUrl(item.main_image)],
                    display_order: item.display_order
                };
            });
        }
    ).catch(() => []); // Fallback to empty array
};

/**
 * Fetches projects from the API with Pagination.
 */
export const fetchProjects = async (page: number = 1): Promise<ProjectItem[]> => {
    return fetchWithCacheAndDedupe(
        `projects_page_${page}`,
        `${API_BASE_URL}/projects?page=${page}`,
        (json) => {
            const dataArray = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
            return dataArray.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category || 'عام',
                category_id: item.category_id,
                main_image: getFileUrl(item.main_image),
                display_order: item.display_order
            }));
        }
    ).catch(() => []); // Fallback to empty array
};

/**
 * Fetches a single project detail by ID.
 */
export const fetchProjectById = async (id: number): Promise<ProjectItem | null> => {
    return fetchWithCacheAndDedupe(
        `project_detail_${id}`,
        `${API_BASE_URL}/projects/${id}`,
        (json) => {
            const item = json.data || json;
            
            // Helper to parse lists safely
            const parseList = (val: any) => {
                if (Array.isArray(val)) return val;
                if (typeof val === 'string') {
                    try { return JSON.parse(val); } catch { return []; }
                }
                return [];
            };

            const imagesRaw = parseList(item.images);
            const images = imagesRaw.map((img: any) => {
                const path = typeof img === 'string' ? img : (img?.url || img?.path || '');
                return getFileUrl(path);
            }).filter((url: string) => url !== '');

            const mainImgUrl = getFileUrl(item.main_image);
            if (!images.includes(mainImgUrl) && mainImgUrl) {
                images.unshift(mainImgUrl);
            }

            let features: ProjectFeature[] = [];
            if (Array.isArray(item.features)) {
                features = item.features.map((f: any) => ({
                    title: f.title || '',
                    description: f.description || ''
                }));
            }

            let videos: ProjectVideo[] = [];
            if (Array.isArray(item.videos)) {
                videos = item.videos.map((v: any) => ({
                    type: v.type || 'url',
                    provider: v.provider || 'other',
                    title: v.title || '',
                    url: v.url || null,
                    iframe: v.iframe || null
                }));
            }

            return {
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category || 'عام',
                category_id: item.category_id,
                main_image: getFileUrl(item.main_image),
                content: item.content,
                images: images,
                videos: videos,
                features: features,
                display_order: item.display_order
            };
        }
    ).catch((err) => {
        console.warn(`Project detail fetch failed for ID ${id}`, err);
        return null;
    });
};

/**
 * Send Contact Message via API (POST requests are not cached)
 */
export const sendContactMessage = async (formData: FormData): Promise<any> => {
  const CONTACT_URL = `${API_BASE_URL}/contact-messages`;

  try {
    const response = await fetch(CONTACT_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Error ${response.status}: ${response.statusText}`);
    }

    return json;
  } catch (error) {
    console.error('Submission failed:', error);
    throw error;
  }
};

/**
 * Subscribe to Newsletter via API (POST requests are not cached)
 */
export const subscribeNewsletter = async (email: string): Promise<any> => {
  const SUBSCRIBE_URL = `${API_BASE_URL}/subscribe`;

  try {
    const response = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw json;
    }

    return json;
  } catch (error) {
    console.error('Subscription failed:', error);
    throw error;
  }
};

/**
 * Track Analytics Event (Fire and forget, no caching needed)
 */
export const trackAnalyticsEvent = (data: any) => {
  const TRACK_URL = `${API_BASE_URL}/analytics/track`;

  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(data),
    keepalive: true
  }).catch(() => {
    // Silent fail
  });
};
