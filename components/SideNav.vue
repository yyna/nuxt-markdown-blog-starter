<template>
    <div class="side-nav">
        <div @click="status = true" class="side-nav__toggle">
            <fa :icon="['fas', 'bars']"  />
        </div>
        <div class="side-nav__container" v-if="status">
            <div class="side-nav-backdrop" @click="status = false"></div>
        </div>
        <div :class="{'side-nav-content': true, active: status }">
            <div @click="status = false">
                <nuxt-link :to="localePath('index')" :class="{ ani: true }">home</nuxt-link>
            </div>
            <div @click="status = false">
                <nuxt-link :to="localePath('blog')" :class="{ ani: true }">blog</nuxt-link>
            </div>
            <div>
                <LangSwitcher class="lang-switcher" />
            </div>
        </div>
    </div>
</template>

<script>
import LangSwitcher from '~/components/LangSwitcher';

export default {
    name: 'SideNav',
    components: { LangSwitcher },

    data() {
        return {
            status: false
        }
    }
}
</script>

<style lang="scss">
.side-nav {
    &__toggle {
        font-size: 2rem;
    }
    
    &__container {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        
        & .side-nav-backdrop {
            background-color: $secondary;
            opacity: 0.6;
            height: 100%;
        }
    }

    & .side-nav-content {
        position: fixed;
        z-index: 2;
        left: 0;
        background-color: $primary;
        position: fixed;
        width: 100%;
        top: -100%;
        padding: 1.5em;
        text-align: center;
        transition: top 600ms;

        &.active {
            top: 0;
        }

        & > div {
            padding: 1rem;
        }

        a {
            color: $text-negative !important;
            font-weight: 600;
        }
    }
}
</style>