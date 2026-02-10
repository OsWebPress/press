<script setup lang="ts">
import { computed } from 'vue';
import PrefixMatcher from '@/library/PrefixMatcher';
import makedownRegistry from '@/library/makedown';
import LoadComponent from './LoadComponent.vue';

// Define the shape of our MatchResult for TypeScript clarity
interface MatchResult {
  tag: string;
  // ... other properties
}

// Define props
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
});

const matcher = new PrefixMatcher(makedownRegistry);

// Computed property handles the reactivity
const parsedContent = computed<MatchResult[]>(() => {
  return matcher.scanString(props.content);
});
</script>

<template>
  <div>
    <LoadComponent
      v-for="(token, index) in parsedContent"
      :key="index"
      :_component="token.tag"
      v-bind="token.props"
    >
      {{ token.body }}
    </LoadComponent>
  </div>
</template>
