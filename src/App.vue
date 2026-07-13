<template>
  <div class="desktop-shell">
    <main class="phone-shell">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page-shift" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
