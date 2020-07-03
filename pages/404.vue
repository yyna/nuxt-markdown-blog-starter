<template>
  <div class="container not-found">
    <h2>{{ $t('pageNotFound') }}</h2>
    <nuxt-link :to="localePath({ name: 'index' })" class="button">
      <button>
        <fa :icon="['fas', 'arrow-left']" class="arrow-icon" /> Return to Home
      </button>
    </nuxt-link>
  </div>
</template>

<style lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .h2 {
    color: $grey-2;
  }

  .button {
    margin-top: 10px;
  }

  .arrow-icon {
    margin-right: 10px;
  }
}
</style>
