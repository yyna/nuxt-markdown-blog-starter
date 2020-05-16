<template>
  <div class="work" :date-is="work.period">
    <div>
      <b class="name">{{ name }}</b>
      <span class="position">{{ work.position }}</span>
    </div>
    <div class="links">
      <a
        v-if="work.homepage"
        :href="work.homepage"
        target="_blank"
        class="ani link-item"
      >
        <fa :icon="['fas', 'home']" />
      </a>
      <a
        v-if="work.android"
        :href="work.android"
        target="_blank"
        class="ani link-item"
      >
        <fa :icon="['fab', 'google-play']" />
      </a>
      <a v-if="work.ios" :href="work.ios" target="_blank" class="ani link-item">
        <fa :icon="['fab', 'apple']" />
      </a>
    </div>
    <p>
      {{ description }}
    </p>
    <p>
      {{
        work.working ? $t('atTheMomentIAmLearning') : $t('hereIsWhereILearnt')
      }}: <b>{{ work.technologyStacks }}</b>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    work: {
      type: Object,
    },
  },

  computed: {
    name() {
      return this.$i18n.locale === 'ko' ? this.work.name.ko : this.work.name.en;
    },
    description() {
      return this.$i18n.locale === 'ko'
        ? this.work.description.ko
        : this.work.description.en;
    },
  },
};
</script>

<style lang="scss" scoped>
// ----------------  THE BASICS
body {
  font-size: 14px;
  line-height: 1.5;
}

// ----------------  LAYOUT

.container {
  max-width: 1024px;
  width: 90%;
  margin: 0 auto;
}

// ----------------  THE FONTS

.work {
  padding: 3em 2em 2em;
  position: relative;
  color: $grey-2;
  border-left: 1px solid $grey-3;

  .name {
    font-size: 2.4rem;
    color: $grey-1;
  }

  .position {
    margin-left: 0.9rem;
  }

  .links {
    margin: 1rem 0;

    .link-item {
      margin-left: 0.3rem;
      font-size: 1.8rem;
    }
  }

  p {
    font-size: 1.5rem;
    margin: 1rem 0;
  }

  &::before {
    content: attr(date-is);
    position: absolute;
    left: 2em;
    font-weight: bold;
    top: 2em;
    display: block;
    font-weight: 700;
    font-size: 0.785rem;
    color: $grey-2;
  }

  &::after {
    width: 10px;
    height: 10px;
    display: block;
    top: 1.1em;
    position: absolute;
    left: -5px;
    border-radius: 10px;
    content: '';
    background: $primary;
  }
}
</style>
