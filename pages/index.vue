<template>
  <div class="page-index">
    <!-- About me -->
    <div class="container">
      <h2>About me 🙋🏻‍♀️</h2>      
      <div class="profiles">
        <a href="https://github.com/yyna" target="_blank" class="ani">
          <fa :icon="['fab', 'github']"  />
        </a>
        <a href="https://www.linkedin.com/in/jungin/" target="_blank" class="ani">
          <fa :icon="['fab', 'linkedin']"  />
        </a>
      </div><br />
    </div>
    <div class="code">
      <div class="container">
        <code>{
      "Name": "Jungin Kwon",
      "Location": "Seoul, Korea 🇰🇷",
      "Job": "Software Engineer",
      "Technology Stacks": {
          "Back-end Development": ["Node.js", "MySQL", "MongoDB", "RESTful API", "Vue.js", "Amazon Web Services"],
          "Front-end Development": ["Vue.js", "Nuxt.js", "Sass"],
      }
  }
        </code>
      </div>
    </div>

    <!-- Challenging -->
    <div class="container">
      <h2>These days</h2>
      <div>100-days-of-code-algorithm</div>
    </div>

    <!-- Work Experience -->
    <div class="container">
      <h2>Work Experience</h2>
      <Work v-for="(work, index) in works" :key="index" :work="work"/>
    </div>
  </div>
</template>

<script>
import Work from '~/components/Work'

export default {
  components: { Work },

  transition: {
    name: 'slide-fade',
  },

  data() {
    return {
      works: [
        {
          name: 'Choreofactory',
          period: 'Aug, 2019 - Mar, 2020',
          description: 'description'
        },
        {
          name: 'Dr.Diary',
          period: 'Jan, 2019 - Jul, 2019',
          description: 'description'
        },
        {
          name: 'Uconnec',
          period: 'Jul, 2017 - Sep, 2018',
          description: 'description'
        }
      ]
    }
  }
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

}
</style>
