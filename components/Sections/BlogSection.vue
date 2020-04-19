<template>
  <section>
    <ul class="blogs">
      <blog-card v-for="blog in blogs" :key="blog.name" :blog="blog" />
    </ul>
  </section>
</template>
<script>
import BlogCard from '~/components/BlogCard.vue';

export default {
  components: { BlogCard },
  props: {
    blogs: {
      type: Array,
    },
  },
};
</script>
<style lang="scss">
.blogs {
  margin: 0;
  margin-top: 12px;

  @media (min-width: $screen-sm) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;
    display: grid;
    margin-top: 24px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 4rem;
  }
}
</style>
