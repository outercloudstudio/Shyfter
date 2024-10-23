<script setup lang="ts">
defineProps({
	icon: {
		type: String,
		required: true,
	}
})
</script>

<template>
	<span
		class="material-symbols-rounded select-none"
	>
		{{ icon }}
	</span>
</template>