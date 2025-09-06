import api from '../utils/axios';

// Heat Options API Service
class HeatOptionsService {
  // Get heat options
  async getHeatOptions(params?: Record<string, any>) {
    try {
      const response = await api.get('/heat-options', { params });
      // Handle nested data structure: response.data.data.data
      return response.data?.data?.data || response.data?.data || response.data || [];
    } catch (error: any) {
      console.error('Error fetching heat options:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch heat options');
    }
  }

  // Get single heat option
  async getHeatOption(id: number) {
    try {
      const response = await api.get(`/heat-options/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error fetching heat option:', error);
      if (error.response?.status === 404) {
        throw new Error('Heat option not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch heat option');
    }
  }

  // Create heat option
  async createHeatOption(data: {
    name: string;
    description?: string;
    image: File;
    price_tier_ids: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        
        // Append single image (not as array) - heat options have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Debug: Log FormData contents
        console.log('Heat Option FormData being sent:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        const response = await api.post('/heat-options', formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Fallback to JSON if no image
        const response = await api.post('/heat-options', data);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      console.error('Error creating heat option:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to create heat option');
    }
  }

  // Update heat option
  async updateHeatOption(id: number, data: {
    name?: string;
    description?: string;
    image?: File | null;
    price_tier_ids?: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        
        // Append single image (not as array) - heat options have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Use POST with _method: PUT for FormData (Laravel convention)
        formData.append('_method', 'PUT');
        
        // Debug: Log FormData contents
        console.log('Heat Option Update FormData being sent:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        const response = await api.post(`/heat-options/${id}`, formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Fallback to JSON if no image
        const response = await api.put(`/heat-options/${id}`, data);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      console.error('Error updating heat option:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.status === 404) {
        throw new Error('Heat option not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update heat option');
    }
  }

  // Delete heat option
  async deleteHeatOption(id: number) {
    try {
      const response = await api.delete(`/heat-options/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error deleting heat option:', error);
      if (error.response?.status === 404) {
        throw new Error('Heat option not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete heat option');
    }
  }

  // Get price tiers (used by heat option forms)
  async getPriceTiers(params?: Record<string, any>) {
    try {
      const response = await api.get('/price-tiers', { params });
      return response.data?.data || response.data || [];
    } catch (error: any) {
      console.error('Error fetching price tiers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch price tiers');
    }
  }
}

// Export singleton instance
export const heatOptionsService = new HeatOptionsService();
export default heatOptionsService;
