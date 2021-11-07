<template>
  <div class="forecast-wrap">
    <div class="forecast">
      <span>{{formattedDate}}</span>
      <div class="img-wrap">
        <img :src="weatherImg" alt="weather" />
      </div>
      <div class="max-min-temp">
        <span max="max">{{Math.round(max)}}°{{isCelsius ? 'C' : 'F'}}</span>
        <span class="min">{{Math.round(min)}}°{{isCelsius ? 'C' : 'F'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { format, isTomorrow } from 'date-fns';

export default {
  name: 'SmallWeather',
  props: {
    date: Date,
    weather: String,
    isCelsius: Boolean,
    max: Number,
    min: Number,
  },
  computed: {
    formattedDate() {
      return isTomorrow(new Date(this.date)) ? 'Tomorrow' : format(new Date(this.date), 'E, d MMM');
    },
    weatherImg() {
      return `../assets/${this.weather.split(' ').join('')}.png`;
    },
  },
};
</script>

<style lang="scss" scoped>
.forecast-wrap {
  position: relative;
  width: 100%;
  flex: 0 0 50%;
  max-width: 50%;
}

.forecast {
  min-height: 205px;
  margin: 14px 14px;
  padding: 18px 22px;
  background: $primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .img-wrap {
    width: 60%;
    margin: 16px 0 28px;

    img {
      max-width: 100%;
    }
  }

  .max-min-temp {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .min {
      color: $grey;
    }
  }
}

@media (min-width: 1200px) {
  .forecast-wrap {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
