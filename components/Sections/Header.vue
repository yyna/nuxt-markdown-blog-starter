<template>
  <header>
    <div class="header">
      <div class="container header-container">
        <div class="header__home">
          <nuxt-link to="/" class="home">
            { yyna.dev }
          </nuxt-link>
        </div>

        <!-- navigation -->
        <div class="navigation-items">
          <nuxt-link to="/blog" class="ani">blog</nuxt-link>
          <LangSwitcher class="lang-switcher" />
        </div>

        <!-- toggle menu -->
        <div class="drop-toggle-button">
          <div>Menu</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LangSwitcher from '~/components/LangSwitcher';

export default {
  components: { LangSwitcher },
};
</script>

<style lang="scss">
.header {
  background-color: $primary;
  height: 7rem;
  padding: 1.5em 0;

  @media (min-width: $screen-sm) {
    height: 9rem;
    transition: height 0.75s;
  }

  &-container {
    display: flex;
    justify-content: space-between;
    // width: 100%;

    @media (min-width: $screen-sm) {
      flex-direction: row;
    }
  }

  &__home {
    a {
      color: $text-negative !important;
      font-weight: 600;
      font-size: 2rem;

      @media (min-width: $screen-sm) {
        font-size: 3rem;
        transition: font-size 0.75s;
      }
    }
  }

  .navigation-items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      color: $primary-light !important;
      font-size: 1.2rem;
      display: none;
      border-bottom: 1px solid $primary;

      @media (min-width: $screen-sm) {
        font-size: 1.8rem;
        transition: font-size 0.75s;
        display: flex;
      }

      &:hover,
      &.nuxt-link-active,
      &:focus {
        color: $text-negative !important;
        transition: all 0.4s;
      }
    }

    .lang-switcher {
      display: none;
      @media (min-width: $screen-sm) {
        display: flex;
      }

      margin-left: 2.4rem;
    }
  }

  .drop-toggle-button {
    color: $text-negative !important;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.2rem;
    @media (min-width: $screen-sm) {
      display: none;
    }
  }
}
</style>
