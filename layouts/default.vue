<template>
  <div class="layout">
    <Header />
    <nuxt class="nuxt-content" />
    <Footer />
  </div>
</template>
<script>
import Header from '~/components/Sections/Header';
import Footer from '~/components/Sections/Footer';

export default {
  components: {
    Header,
    Footer,
  },
};
</script>
<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nuxt-content {
  flex-grow: 1;
}
</style>
