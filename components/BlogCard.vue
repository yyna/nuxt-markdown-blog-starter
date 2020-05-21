<template>
  <li class="blog">
    <nuxt-link
      :to="localePath({ name: 'blog-slug', params: { slug: blog.name } })"
    >
      <ImageResponsive
        :imageURL="`blog/${blog.id}/_thumbnail.png`"
        :classes="'cardThumbnail'"
        :width="'952'"
        :height="'509'"
        :alt="blog.cardAlt"
      />
      <div class="blog__category">{ {{ blog.category }} }</div>
      <h3 class="blog__title">
        {{ blog.title }}
      </h3>
      <p class="blog__description">
        {{ blog.description }}
      </p>
    </nuxt-link>
  </li>
</template>

<script lang="js">
export default {
  props: {
    blog: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
.cardThumbnail {
  transition: all ease 0.75s;
  opacity: 0.7;
  &[lazy='loaded'] {
    opacity: 1;
  }
}
.blog {
  list-style-type: none;

  @media (min-width: $screen-sm) {
    padding-bottom: 0;

    &:last-child {
      margin-right: 0;
    }
  }

  &:hover {
    .blog__title {
      color: $primary;
    }
  }

  &__category {
    margin-top: 1rem;
    margin-bottom: 0.2rem;
  }

  &__title {
    color: $secondary;
    font-size: 2.5rem;
    transition: color 0.3s;
  }

  &__description {
    margin: 0;
    color: $grey-2;
  }
}
</style>
