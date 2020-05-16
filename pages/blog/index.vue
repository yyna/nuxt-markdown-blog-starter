<template>
  <div class="blog-index">
    <div class="container">
      <div class="blogs__top"></div>
      <Category
        v-for="(count, category) in categories"
        :key="category"
        :category="category"
        :count="count"
        :click="changeCategory"
        :class="{ active: selected === category }"
      />
      <BlogSection :blogs="filteredBlogs" />
    </div>
  </div>
</template>

<script>
import BlogSection from '~/components/Sections/BlogSection';
import Category from '~/components/Category';

import blogsEn from '~/contents/en/blogsEn.js';
import blogsKo from '~/contents/ko/blogsKo.js';

export default {
  async asyncData({ app }) {
    const blogs = app.i18n.locale === 'en' ? blogsEn : blogsKo;

    async function asyncImport(blogName) {
      const wholeMD = await import(
        `~/contents/${app.i18n.locale}/blog/${blogName}.md`
      );
      return wholeMD.attributes;
    }

    return Promise.all(blogs.map((blog) => asyncImport(blog))).then((res) => {
      const categories = {};
      res.forEach((res) => {
        if (res.category in categories) {
          categories[res.category] += 1;
        } else {
          categories[res.category] = 1;
        }
      });
      return {
        blogs: res,
        categories,
      };
    });
  },

  components: { BlogSection, Category },

  transition: {
    name: 'slide-fade',
  },

  head() {
    return {
      title: this.$t('indexPageHead.title'),
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
      script: [
        { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
      ],
      meta: [
        { name: 'author', content: 'Jungin Kwon' },
        {
          name: 'description',
          property: 'og:description',
          content: this.$t('indexPageHead.description'),
          hid: 'description',
        },
        { property: 'og:title', content: this.$t('indexPageHead.title') },
        { property: 'og:image', content: this.ogImage },
        {
          name: 'twitter:description',
          content: this.$t('indexPageHead.description'),
        },
        { name: 'twitter:image', content: this.ogImage },
      ],
    };
  },

  computed: {
    ogImage: function() {
      return;
    },
    filteredBlogs() {
      return this.selected === undefined
        ? this.blogs
        : this.blogs.filter((blog) => {
            return blog.category === this.selected;
          });
    },
  },

  data() {
    return {
      selected: undefined,
    };
  },

  methods: {
    changeCategory(category) {
      this.selected = this.selected === category ? undefined : category;
    },
  },
};
</script>
