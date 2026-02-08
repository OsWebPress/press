import { defineStore } from 'pinia'
import { loadComponent } from 'vue3-external-component'
import { ref } from 'vue'
import type { Component } from 'vue'

export const useComponentsStore = defineStore('components', () => {
  const components = ref({});

  async function getComponent(componentUrl: string): Promise<Component> {
    if (components.value[componentUrl]) {
      console.log(`✅ Component found in cache for URL: ${componentUrl}`);
      return components.value[componentUrl];
    }

	try {
    	components.value[componentUrl] = loadComponent(componentUrl);
	} catch (error) {
		console.error(`❌ Failed to load component from URL: ${componentUrl}`);
	}
	console.log(`🔄 Loading component from URL: ${componentUrl}`);
    return components.value[componentUrl];
  }

  return { getComponent }
});