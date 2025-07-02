// API服务配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// AI评价接口类型定义
export interface AIEvaluation {
  content: string;
  likes: number;
  created_at: string;
  success: boolean;
}

// 作品接口类型定义
export interface Work {
  id: string;
  title: string;
  type: string;
  content: string;
  tags: string[];
  likes: number;
  views: number;
  file_path?: string;
  created_at: string;
  updated_at?: string;
  ai_evaluation?: AIEvaluation;
}

export interface CreateWorkData {
  title: string;
  type: string;
  content: string;
  tags: string;
  file?: File;
}

export interface WorksResponse {
  works: Work[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface StatsResponse {
  total_works: number;
  total_likes: number;
  total_views: number;
  total_types: number;
}

// 活动记录接口类型定义
export interface Activity {
  id: string;
  type: 'create' | 'like';
  description: string;
  work_id?: string;
  work_title?: string;
  created_at: string;
}

// AI续写接口类型定义
export interface ContinuationRequest {
  content: string;
  type: string;
  title?: string;
  style?: 'continue' | 'expand' | 'dialogue' | 'action' | 'emotion';
}

export interface ContinuationResponse {
  success: boolean;
  continuation: string;
  timestamp: string;
}

// API请求封装
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // 获取所有作品
  async getWorks(params: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  } = {}): Promise<WorksResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/works${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<WorksResponse>(endpoint);
  }

  // 获取单个作品
  async getWork(id: string): Promise<Work> {
    return this.request<Work>(`/works/${id}`);
  }

  // 创建作品
  async createWork(data: CreateWorkData): Promise<Work> {
    // 如果有文件，使用 FormData，否则使用 JSON
    if (data.file) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('content', data.content);
      formData.append('tags', data.tags);
      formData.append('file', data.file);

      const response = await fetch(`${API_BASE_URL}/works`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } else {
      // 使用 JSON 格式
      return this.request<Work>('/works', {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          type: data.type,
          content: data.content,
          tags: data.tags
        })
      });
    }
  }

  // 更新作品
  async updateWork(id: string, data: CreateWorkData): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('content', data.content);
    formData.append('tags', data.tags);
    
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await fetch(`${API_BASE_URL}/works/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 删除作品
  async deleteWork(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/works/${id}`, {
      method: 'DELETE',
    });
  }

  // 点赞作品
  async likeWork(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/works/${id}/like`, {
      method: 'POST',
    });
  }

  // 点赞AI评价
  async likeAIEvaluation(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/works/${id}/ai-evaluation/like`, {
      method: 'POST',
    });
  }

  // 获取统计信息
  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/stats');
  }

  // 获取最新动态
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return this.request<Activity[]>(`/activities?limit=${limit}`);
  }

  // AI续写功能
  async generateContinuation(data: ContinuationRequest): Promise<ContinuationResponse> {
    return this.request<ContinuationResponse>('/ai/continue', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 检查服务器连接
  async checkConnection(): Promise<boolean> {
    try {
      await this.request('/stats');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 导出API服务实例
export const apiService = new ApiService();

// 导出便捷方法
export const {
  getWorks,
  getWork,
  createWork,
  updateWork,
  deleteWork,
  likeWork,
  likeAIEvaluation,
  getStats,
  getActivities,
  generateContinuation,
  checkConnection
} = apiService;
