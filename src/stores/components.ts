import { defineStore } from 'pinia'
import { loadComponent } from 'vue3-external-component'
import { ref } from 'vue'

export const useComponentsStore = defineStore('components', () => {
  const components = ref({});

  async function getComponent(componentUrl: string): Promise<any> {
    if (components.value[componentUrl]) {
      console.log(`✅ Component found in cache for URL: ${componentUrl}`);
      return components.value[componentUrl];
    }

    components.value[componentUrl] = loadComponent(componentUrl);
	console.log(`🔄 Loading component from URL: ${componentUrl}`);
    return components.value[componentUrl];
  }

  return { getComponent }
});