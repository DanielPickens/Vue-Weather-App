<template>
  <div class="search-drawer" :class="{ open: isOpen, close: !isOpen }">
    <i class="material-icons close-icon" @click="closeHandler">close</i>

    <div class="search-form">
      <div class="search-bar">
        <label>
          <i class="material-icons">search</i>
          <input
            v-model="location"
            type="text"
            placeholder="search location"
            @keyup.enter="searchSubmitHandler"
          />
        </label>
      </div>
      <div class="search-btn-wrap">
        <mdb-btn class="search-btn" @click="searchSubmitHandler">Search</mdb-btn>
      </div>
    </div>

    <div class="search-results">
      <spinner v-if="loading"></spinner>

      <p v-else-if="locations.length === 0">No results</p>

      <div
        v-else
        v-for="location in locations"
        :key="location.woeid"
        @click="$emit('clickLocation', location.woeid)"
      >{{location.title}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mdbBtn } from 'mdbvue';
import Spinner from '@/components/RoundSpinner.vue';

export default {
  name: 'Search',
  components: {
    mdbBtn,
    Spinner,
  },
  props: {
    isOpen: Boolean,
    locations: Array,
  },
  data() {
    return {
      location: '',
    };
  },
  computed: {
    ...mapGetters({
      loading: 'gettersIsLoading',
    }),
  },
  methods: {
    closeHandler() {
      this.location = '';
      this.$emit('close', false);
    },
    searchSubmitHandler() {
      if (this.location !== '') {
        this.$emit('searchLocation', this.location);
      } else {
        alert('Input cannot be empty!');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-drawer {
  position: fixed;
  width: 400px;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 42px;
  background: $primary;
  transition: transform 0.3s ease-out;

  &.open {
    transform: translateX(0);
  }

  &.close {
    transform: translateX(-100%);
  }

  .close-icon {
    margin-left: auto;
    margin-bottom: 15px;
    color: $white;
    font-size: 24px;
    cursor: pointer;
  }
}

.search-form {
  display: flex;

  .search-btn {
    height: 100%;
    background: $info;
    color: $white;
    padding: 0 18px;
  }

  .search-bar {
    width: 100%;
    flex: 1;
    margin-right: 12px;
    padding: 14px 16px;
    border: 1px solid $white;

    label {
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      margin-left: 12px;
      background: transparent;
      color: $white;

      &::placeholder {
        color: $darkgrey;
      }
    }
  }
}

.search-results {
  margin: 48px 0;
  padding: 1px;
  color: $white;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: $grey;
  }

  p {
    color: $grey;
    text-align: center;
  }

  div {
    padding: 24px 16px;
    margin-bottom: 16px;
    box-sizing: border-box !important;
    position: relative;

    &:hover {
      box-shadow: 0 0 0 1px $grey;
      cursor: pointer;

      &::after {
        content: "keyboard_arrow_right";
        font-family: "Material Icons";
        font-size: 24px;
        position: absolute;
        right: 16px;
        color: $grey;
      }
    }
  }
}

@media (max-width: 576px) {
  .search-drawer {
    width: calc(100vw - 48px);
    padding: 24px;
  }
}
</style>
