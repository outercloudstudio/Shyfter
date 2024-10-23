<script setup lang="ts">
import { useRouter } from 'vue-router'
import Icon from './Icon.vue';

defineProps<{ to: string }>()

const router = useRouter()
</script>

<template>
	<div class="absolute top-4 left-4">
		<Icon @click="router.push(to)" icon="arrow_back" class="text-primary"/>
	</div>
</template>