<template>
  <!-- eslint-disable max-len -->
  <div class="app">
    <div class="sidebar">
      <div class="sidebar-wrap">
        <search
          :isOpen="isSearch"
          :locations="locations"
          @close="toggleSearch"
          @clickLocation="handleClickLocation"
          @searchLocation="handleSearchLocation"
        />

        <div class="sidebar-actions">
          <mdb-btn class="sidebar-search" @click="toggleSearch(true)">Search for places</mdb-btn>
          <mdb-tooltip material trigger="hover" :options="{placement: 'bottom'}">
            <span slot="tip">Current location</span>
            <mdb-btn slot="reference" class="sidebar-gps" @click="getCurrentLocation">
              <i class="material-icons">gps_fixed</i>
            </mdb-btn>
          </mdb-tooltip>
        </div>

        <div v-if="!weather.consolidated_weather || loading || errorStr" class="sidebar-error">
          <i class="material-icons">cloud_off</i>
          <spinner v-if="(!weather.consolidated_weather || loading) && !errorStr"></spinner>
          <div v-if="errorStr">
            <h3>Oops!</h3>
            <p>Something just went wrong!</p>
          </div>
        </div>

        <div v-if="weather.consolidated_weather && !loading && !errorStr">
          <big-weather
            :temperature="inCelsius ? weather.consolidated_weather[0].the_temp : toFahrenheit(weather.consolidated_weather[0].the_temp)"
            :weather="weather && weather.consolidated_weather[0].weather_state_name"
            :isCelsius="inCelsius"
          />
        </div>

        <div class="weather-today-details">
          <p class="weather-date">
            Today
            <span>•</span>
            {{today}}
          </p>
          <p class="weather-location">
            <i class="material-icons">location_on</i>
            {{weather.title && !loading && !errorStr ? weather.title : 'Loading...'}}
          </p>
        </div>
      </div>
    </div>

    <div class="main">
      <loader v-if="(!weather.consolidated_weather || loading) && !errorStr"></loader>

      <div v-if="errorStr" class="main-error">
        <h2>Location Not Found</h2>
        <p>To fix this issue, please:</p>
        <ul>
          <li>Allow location services in your browser</li>
          <li>Use the search bar on the top-left instead</li>
        </ul>
      </div>

      <div v-if="weather.consolidated_weather && !loading && !errorStr">
        <div class="cel-fan">
          <mdb-btn
            type="button"
            class="celsius"
            :class="{active: inCelsius}"
            @click="toggleFormat(true)"
          >℃</mdb-btn>
          <mdb-btn
            type="button"
            class="farenheight"
            :class="{active: !inCelsius}"
            @click="toggleFormat(false)"
          >℉</mdb-btn>
        </div>

        <div class="weather-forecast">
          <small-weather
            v-for="i in 5"
            :key="i"
            :date="new Date(weather.consolidated_weather[i].applicable_date)"
            :weather="weather.consolidated_weather[i].weather_state_name"
            :isCelsius="inCelsius"
            :max="inCelsius ? weather.consolidated_weather[i].max_temp : toFahrenheit(weather.consolidated_weather[i].max_temp)"
            :min="inCelsius ? weather.consolidated_weather[i].min_temp : toFahrenheit(weather.consolidated_weather[i].min_temp)"
          />
        </div>

        <h4>Today's Highlights</h4>
        <div class="weather-highlight">
          <card
            title="Wind status"
            :direction="weather.consolidated_weather[0].wind_direction_compass"
            :directionNum="weather.consolidated_weather[0].wind_direction"
          >
            <template v-slot:value>
              {{Math.round(weather.consolidated_weather[0].wind_speed)}}
              <span>mph</span>
            </template>
          </card>

          <card title="Humidity" :percent="weather.consolidated_weather[0].humidity">
            <template v-slot:value>
              {{weather.consolidated_weather[0].humidity}}
              <span>%</span>
            </template>
          </card>

          <card title="Visibility">
            <template v-slot:value>
              {{Math.round(weather.consolidated_weather[0].visibility)}}
              <span>miles</span>
            </template>
          </card>

          <card title="Air Pressure ">
            <template v-slot:value>
              {{Math.round(weather.consolidated_weather[0].air_pressure)}}
              <span>mb</span>
            </template>
          </card>
        </div>
      </div>

      <div class="footer">
        <p> @Daniel Pickens </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  mdbTooltip, mdbBtn,
} from 'mdbvue';
import { format } from 'date-fns';
import Spinner from '@/components/RoundSpinner.vue';
import Loader from '@/components/DribbleDot.vue';
import Search from '@/components/Search.vue';
import BigWeather from '@/components/BigWeather.vue';
import SmallWeather from '@/components/SmallWeather.vue';
import Card from '@/components/Card.vue';

export default {
  name: 'App',
  components: {
    mdbTooltip,
    mdbBtn,
    Spinner,
    Loader,
    Search,
    BigWeather,
    SmallWeather,
    Card,
  },
  data() {
    return {
      dateNow: Date.now(),
      isSearch: false,
      inCelsius: true,
      isGettingLocation: false,
      errorStr: '',
    };
  },
  computed: {
    today() {
      return format(this.dateNow, 'E, d MMM');
    },
    ...mapGetters({
      locations: 'gettersLocations',
      weather: 'gettersWeather',
      loading: 'gettersIsLoading',
    }),
  },
  watch: {
    locations(newVal) {
      if (!this.isSearch) {
        this.getWeather(newVal[0].woeid);
      }
    },
  },
  methods: {
    toggleSearch(isOpen) {
      this.isSearch = isOpen;
    },
    toggleFormat(isCelsius) {
      this.inCelsius = isCelsius;
    },
    toFahrenheit(num) {
      return ((num * 9) / 5) + 32;
    },
    handleSearchLocation(name) {
      this.getLocationsByName(name.split(' ').join('+'));
    },
    handleClickLocation(id) {
      this.isSearch = false;
      this.errorStr = '';

      this.getWeather(id);
    },
    getCurrentLocation() {
      if (!('geolocation' in navigator)) {
        this.errorStr = 'Location services is not available.';
        return;
      }

      this.isGettingLocation = true;
      navigator.geolocation.getCurrentPosition((pos) => {
        this.isGettingLocation = false;
        this.getLocations({
          latitude: `${pos.coords.latitude}`,
          longitude: `${pos.coords.longitude}`,
        });
      }, () => {
        this.isGettingLocation = false;
        this.errorStr = 'Could not get current location. Please allow the location service on your browser.';
      });
    },
    ...mapActions({
      getLocations: 'getLocations',
      getLocationsByName: 'getLocationsByName',
      getWeather: 'getWeather',
    }),
  },
  created() {
    this.getCurrentLocation();
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Noto+Sans+JP&&family=Raleway:wght@500;600;700&display=swap");

* {
  font-family: Raleway, sans-serif;
  font-weight: 500;
}

body {
  height: 100vh;
  margin: 0;
  padding: 0;
  color: $white;
  font-size: 1rem;
}

input,
button {
  font-size: 1rem;
  border: none;
  outline: none;
}

button {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

// SIDEBAR
.sidebar {
  position: fixed;
  height: calc(100vh - 84px);
  width: 400px;
  padding: 42px;
  color: $grey;
  background: $primary;
  overflow: hidden;

  .sidebar-error {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    margin-top: 70px;

    i {
      font-size: 200px;
    }

    div {
      text-align: center;

      h3 {
        font-size: 60px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      p {
        font-size: 18px;
      }
    }
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.05;
    background: $primary url("~@/assets/Cloud-background.png") no-repeat 50% 15%;
  }

  .sidebar-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }
}

.sidebar-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .sidebar-search {
    background: $secondary;
    color: $white;
    padding: 12px 18px;
  }

  .sidebar-gps {
    display: flex;
    justify-content: center;
    align-items: center;
    background: $secondary;
    color: $white;
    padding: 9px;
    border-radius: 50%;
  }
}

.weather-today-details {
  text-align: center;

  .weather-date {
    margin-bottom: 32px;

    span {
      margin: 0 16px;
    }
  }

  .weather-location {
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      margin-right: 10px;
    }
  }
}

// MAIN
.main {
  min-height: calc(100vh - 84px);
  margin-left: 484px;
  padding: 42px;
  background: $dark;

  .main-error {
    width: 100%;
    height: calc(100vh - 172px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      font-size: 54px;
      font-weight: 700;
      margin-bottom: 5px;
      text-align: center;
    }
  }

  h4 {
    margin: 40px 14px 24px;
    font-size: 24px;
    font-weight: 700;
  }
}

.cel-fan {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
  padding: 0 14px;

  .celsius,
  .farenheight {
    font-family: "Noto Sans JP", sans-serif;
    min-width: 40px;
    min-height: 40px;
    border-radius: 100%;
    background: #585676;
    color: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.active {
      background: $white;
      color: #110e3c;
    }
  }

  .celsius {
    margin-right: 12px;
  }
}

.weather-forecast,
.weather-highlight {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.footer {
  text-align: center;
  margin: 40px auto 20px;

  p {
    color: $darkgrey;
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    font-weight: 600;
  }
}

@media (max-width: 992px) {
  .sidebar {
    position: static;
    height: calc(100vh - 48px);
    width: calc(100vw - 48px);
    padding: 24px;

    &::before {
      background-size: 150%;
    }
  }

  .main {
    padding: 24px;
    margin-left: 0px;
  }
}
</style>
