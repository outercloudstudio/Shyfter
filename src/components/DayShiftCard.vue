<script setup lang="ts">

</script>
<template>
<Card title="Monday" icon="calendar_today">
	<p>{{ shift.time }} {{ new Date((shift.day?.seconds ?? 0) * 1000) }}</p>
</Card>
</template>