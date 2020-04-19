<template>
  <div class="category" @click="click(category)">
    <b> {{ category }} </b>
    <span class="category__count">{{ count }}</span>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: String,
    },
    count: {
      type: Number,
    },
    click: {
      type: Function,
    },
  },
};
</script>

<style lang="scss">
.category {
  display: inline-block;
  padding: 0.8rem;
  margin-right: 0.8rem;
  margin-bottom: 0.8rem;
  border: 1px solid $primary;
  color: $primary;
  cursor: pointer;
  font-size: 1.2rem;

  @media (min-width: $screen-sm) {
    padding: 1rem;
    font-size: 1.4rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  &:hover,
  &.active {
    background-color: $primary;
    color: $text-negative;
    transition: all 0.75s;
  }

  &__count {
    margin-left: 0.5rem;
  }
}
</style>
