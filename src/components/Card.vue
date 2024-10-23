<script setup lang="ts">
import Icon from './Icon.vue';

defineProps<{ title: string, icon: string, bold?: boolean }>()
</script>

<template>
<div  class="card-outline" :class="{ bold: bold }">
	<div class="card">
		<div class="flex gap-2 items-center mb-2">
			<Icon :icon class="text-primary"/>
			<h4>{{ title }}</h4>
		</div>

		<slot />
	</div>
</div>
</template>

<style scoped>
.card {
	background: var(--element);

	padding: 1rem;

	border-radius: 0.4rem;

	width: 100%;
	height: 100%;
}

.card-outline {
	display: flex;

	padding: 1px;

	border-radius: 0.4rem;

	background: var(--element-border);
}

.card-outline.bold {
	background: linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 100%);
	filter: drop-shadow(0px 0px 30px var(--accent-shadow));
}
</style>