<template>
    <div>
      <component :is="components['1']" />
    </div>
  </template>
  
<script setup>
import { ref, computed,nextTick,onMounted } from "vue"
  
  const components = ref({})
  
  onMounted(async () => {
    const modules = import.meta.glob('./hiprint/*.vue')
    
    for (const path in modules) {
      const module = await modules[path]()
      const componentName = module.default.name || 
        path.split('/').pop().replace('.vue', '')
      
      components.value[componentName] = module.default
    }
  })
  </script>