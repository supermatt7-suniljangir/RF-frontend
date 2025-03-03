export type AppConfig = {
  FILE_LIMITS: {
    avatar: number;
    cover: number;
    MAX_IMAGE_SIZE: number;
    MAX_VIDEO_SIZE: number;
    MAX_FILES: number;
  };
  COMPRESSION_OPTIONS: {
    avatar: {
      maxSizeMB: number;
      maxWidthOrHeight: number;
      useWebWorker: boolean;
    };
    cover: {
      maxSizeMB: number;
      maxWidthOrHeight: number;
      useWebWorker: boolean;
    };
    default: {
      maxSizeMB: number;
      maxWidthOrHeight: number;
      useWebWorker: boolean;
    };
  };
  UPLOAD: {
    RETRY_LIMIT: number;
    CHUNK_SIZE: number;
  };
  URLS: {
    API_URL: string;
    SOCKET_URL: string;
  };
};

export const Config: AppConfig = {
  FILE_LIMITS: {
    avatar: 3 * 1024 * 1024, // 3MB
    cover: 5 * 1024 * 1024, // 5MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_FILES: 10,
  },
  COMPRESSION_OPTIONS: {
    avatar: {
      maxSizeMB: 3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    },
    cover: {
      maxSizeMB: 5,
      maxWidthOrHeight: 3200,
      useWebWorker: true,
    },
    default: {
      maxSizeMB: 5,
      maxWidthOrHeight: 3200,
      useWebWorker: true,
    },
  },
  UPLOAD: {
    RETRY_LIMIT: 3,
    CHUNK_SIZE: 10 * 1024 * 1024, // 10MB per chunk
  },
  URLS: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api",
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5500",
  },
};
