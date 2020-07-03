<template>
  <footer>
    <div class="footer__info">
      <div class="container footer__info-container">
        <div class="footer__copyright">
          @ 2020 -
          <span
            >Web app coded by
            <a target="_blank" href="https://yyna.dev/" class="ani"
              ><span>Jungin Kwon</span></a
            ></span
          >
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style lang="scss">
.footer {
  &__info {
    background-color: $background-secondary;
    padding: 1.5em 0;
  }

  &__info-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-direction: column;

    @media (min-width: $screen-sm) {
      flex-direction: row;
    }
  }

  &__copyright {
    text-align: center;
    @media (min-width: $screen-sm) {
      text-align: inherit;
    }
  }

  &__top-page {
    color: $text-negative;
    display: block;
    text-align: center;
    line-height: 1;
    -webkit-transition: 1s;
    -moz-transition: 1s;
    transition: 1s;

    @media (min-width: $screen-sm) {
      text-align: right;
    }
  }
}
</style>
