<template>
  <div class="page-index">
    <!-- New Posts -->
    <div class="container">
      <h2>🏝 New Posts 🍹</h2>
      <div class="view-more">
        <nuxt-link :to="localePath({ name: 'blog' })" class="ani">
          More posts <fa :icon="['fas', 'arrow-right']" class="arrow-icon"/>
        </nuxt-link>
      </div>
      <BlogSection :blogs="blogs" />
    </div>

    <!-- About me -->
    <div class="container">
      <h2>About me 🙋🏻‍♀️</h2>
      <div class="profiles">
        <a href="https://github.com/yyna" target="_blank" class="ani">
          <fa :icon="['fab', 'github']" />
        </a>
        <a
          href="https://www.linkedin.com/in/jungin/"
          target="_blank"
          class="ani"
        >
          <fa :icon="['fab', 'linkedin']" />
        </a>
        <a
          href="https://twitter.com/yyna_kwon"
          target="_blank"
          class="ani"
        >
          <fa :icon="['fab', 'twitter']" />
        </a>
      </div>
      <br />
    </div>
    <div class="code">
      <div class="container">
        <code>
  {
      "Name": "Jungin Kwon",
      "Location": "Seoul, Korea 🇰🇷",
      "Job": "Software Engineer",
      "Technology Stacks": {
          "Back-end Development": ["PostgreSQL", "Node.js", "MySQL", "MongoDB", "RESTful API"],
          "Front-end Development": ["Responsive web", "Vue.js", "Nuxt.js", "Sass"],
          "DevOps": ["Kubernetes", "Amazon Web Services"]
      }
  }
        </code>
      </div>
    </div>

    <!-- Work Experience -->
    <div class="container">
      <h2>Work Experience 👩🏻‍💻</h2>
      <Work v-for="(work, index) in works" :key="index" :work="work" />
    </div>
  </div>
</template>

<script>
import Work from '~/components/Work';
import BlogSection from '~/components/Sections/BlogSection';

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

    return Promise.all(blogs.slice(0, 2).map((blog) => asyncImport(blog))).then((res) => {
      return {
        blogs: res,
      };
    });
  },

  components: { Work, BlogSection },

  transition: {
    name: 'slide-fade',
  },

    head() {
    return {
      title: '{ yyna.dev }',
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
      meta: [
        { name: 'author', content: 'Jungin Kwon' },
        {
          name: 'description',
          property: 'og:description',
          content: "Jungin Kwon's Dev Blog",
          hid: 'description',
        },
        { property: 'og:title', content: '{ yyna.dev }' },
        {
          property: 'og:image',
          content: `${process.env.baseUrl}/images/_thumbnail.png`,
        },
        { property: 'og:image:width', content: 900 },
        { property: 'og:image:height', content: 481 },
        { name: 'twitter:description', content: "Jungin Kwon's Dev Blog" },
        {
          name: 'twitter:image',
          content: `${process.env.baseUrl}/images/_thumbnail.png`,
        },
      ],
    };
  },

  data() {
    return {
      works: [
        {
          name: {
            en: 'Miso',
            ko: '미소',
          },
          period: 'May, 2020 - Present',
          position: 'Back-end Developer',
          description: {
            en:
              'Miso is Korea\'s No. 1 home service company that provides all necessary services for daily life, from domestic help to moving to interior.',
            ko:
              '미소는 가사도우미부터 이사, 인테리어까지 생활에 필요한 모든 서비스를 제공하는 대한민국 1등 홈서비스 회사입니다.',
          },
          technologyStacks: 'Kubernetes, PostgreSQL, GraphQL',
          homepage: 'https://miso.kr',
          android: 'https://play.google.com/store/apps/details?id=com.miso&hl=ko',
          ios: 'https://apps.apple.com/kr/app/%EB%AF%B8%EC%86%8C/id1071778654',
          working: true,
        },
        {
          name: {
            en: 'Choreofactory',
            ko: '안무공장',
          },
          period: 'Aug, 2019 - Mar, 2020',
          position: 'Full-stack Developer',
          description: {
            en:
              'Choreofactory was established to discover and protect the rights of dancers and music artists and maximize the value of the content they create. I was responsible for the development of the back-end of the mobile app BEATFLO and the back-end and front-end of web service BEATFLO Dashboard and BEATFLO homepage',
            ko:
              '안무공장은 댄서와 음악 아티스트의 권리를 발견, 보호하고 그들이 창작하는 컨텐츠의 가치를 극대화하고자 설립된 회사입니다. 모바일 앱 BEATFLO의 백엔드 개발과 웹 서비스 BEATFLO Dashboard, BEATFLO 홈페이지의 백엔드, 프론트엔드 개발을 담당했습니다.',
          },
          technologyStacks: 'Vue.js, Nuxt.js, Sass',
          homepage: 'https://www.beatflo.co',
          android:
            'https://play.google.com/store/apps/details?id=com.choreofactory.beatflo',
          ios: 'https://apps.apple.com/us/app/beatflo/id1492668671',
        },
        {
          name: {
            en: 'Dr.Diary',
            ko: '닥터다이어리',
          },
          period: 'Jan, 2019 - Jul, 2019',
          position: 'Back-end Developer',
          description: {
            en:
              'Dr. Diary was established to improve the lives of diabetics. Diabetics can record their blood sugar and diet, and communicate with other diabetics through the mobile app Dr.Diary. I was responsible for the back-end development of mobile apps at this company.',
            ko:
              '닥터다이어리는 당뇨인들의 좀 더 나은 삶을 위해 설립된 회사입니다. 당뇨인들은 모바일 앱 닥터다이어리를 통해 혈당, 식단 관리 및 다른 당뇨인들과 당뇨 관련 정보를 주고 받을 수 있습니다. 저는 이 회사에서 모바일 앱의 백엔드 개발을 담당했습니다.',
          },
          technologyStacks: 'MongoDB, Node.js, Typescript, Serverless',
          homepage: 'https://www.drdiary.co.kr',
          android:
            'https://play.google.com/store/apps/details?id=com.hansjin.drdiary_android',
          ios:
            'https://apps.apple.com/kr/app/%EB%8B%A5%ED%84%B0%EB%8B%A4%EC%9D%B4%EC%96%B4%EB%A6%AC-%EB%8B%B9%EB%87%A8-%ED%98%88%EB%8B%B9-%EA%B4%80%EB%A6%AC/id1156758689',
        },
        {
          name: {
            en: 'Uconnec',
            ko: '유커넥',
          },
          period: 'Jul, 2017 - Sep, 2018',
          position: 'Full-stack Developer',
          description: {
            en:
              'Uconnec is a company that creates a web platform to automate the matching of advertising campaigns between YouTube creators and advertisers. I was responsible for the front-end and back-end development of the platform.',
            ko:
              '유커넥은 YouTube 크리에이터와 광고주 매칭을 자동화하는 웹 플랫폼을 만드는 회사입니다. 웹 프론트엔드와 백엔드 개발을 담당했습니다.',
          },
          technologyStacks: 'AWS, Spring Framework, MySQL, RESTful API',
          homepage: 'https://www.uconnec.com',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.page-index {
  > div {
    padding: 5rem 3rem;
  }

  .profiles {
    a {
      font-size: 2rem;
      margin: 0 0.3rem;
    }
  }

  .code {
    background-color: $secondary-super-lighter;
    padding: 2rem;

    @media (min-width: $screen-sm) {
      padding: 4rem;
    }

    code {
      white-space: pre-wrap;
    }
  }

  .view-more {
    text-align: right;
  }

  .arrow-icon {
    margin-left: 10px;
  }

  section {
    margin-bottom: 0;
  }
}
</style>
