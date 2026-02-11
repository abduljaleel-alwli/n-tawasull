
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

/**
 * Fetches settings from the API.
 */
export const fetchSettings = async (): Promise<Record<string, any>> => {
  const SETTINGS_URL = `${API_BASE_URL}/settings`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    const response = await fetch(SETTINGS_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        console.warn(`Settings API returned status: ${response.status}`);
        return {};
    }
    
    const json: ApiResponse = await response.json();
    const settings: Record<string, any> = {};
    
    if (json.data && Array.isArray(json.data)) {
        json.data.forEach(item => {
            let parsedValue: any = item.value;

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
    console.warn('Settings fetch failed. Using local fallback data.');
    return {};
  }
};

/**
 * Fetches services from the API.
 */
export const fetchServices = async (): Promise<ServiceItem[]> => {
  const SERVICES_URL = `${API_BASE_URL}/services`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(SERVICES_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const json = await response.json();
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
  } catch (error) {
    console.warn('Services fetch failed', error);
    return [];
  }
};

/**
 * Fetches all projects from the API.
 */
export const fetchProjects = async (): Promise<ProjectItem[]> => {
  const PROJECTS_URL = `${API_BASE_URL}/projects`;

  try {
    const response = await fetch(PROJECTS_URL, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) return [];
    
    const json = await response.json();
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

  } catch (error) {
    console.warn('Projects fetch failed', error);
    return [];
  }
};

/**
 * Fetches a single project detail by ID.
 */
export const fetchProjectById = async (id: number): Promise<ProjectItem | null> => {
  const PROJECT_URL = `${API_BASE_URL}/projects/${id}`;

  try {
    const response = await fetch(PROJECT_URL, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

    const json = await response.json();
    const item = json.data || json;

    // Parse Helpers
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

    // Prepend main image to images list if not present
    const mainImgUrl = getFileUrl(item.main_image);
    if (!images.includes(mainImgUrl) && mainImgUrl) {
      images.unshift(mainImgUrl);
    }

    // features
    let features: ProjectFeature[] = [];
    if (Array.isArray(item.features)) {
        features = item.features.map((f: any) => ({
            title: f.title || '',
            description: f.description || ''
        }));
    }

    // videos
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

  } catch (error) {
    console.warn(`Project detail fetch failed for ID ${id}`, error);
    return null;
  }
};
