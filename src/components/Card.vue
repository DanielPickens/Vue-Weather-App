<template>
  <div class="highlights-wrap">
    <div class="highlight">
      <p>{{title}}</p>
      <p class="value">
        <slot name="value"></slot>
      </p>
      <div class="direction" :class="{'no-display': !direction}">
        <i class="material-icons" :style="compass">navigation</i>
        <p>{{direction}}</p>
      </div>
      <div class="percent" :class="{'no-display': !percent}">
        <div class="legend">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div class="bar-wrap">
          <div class="bar-bg"></div>
          <div class="bar-color" :style="percentage"></div>
        </div>
        <p>%</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    direction: String,
    directionNum: Number,
    percent: Number,
  },
  computed: {
    percentage() {
      return { width: `${this.percent}%` };
    },
    compass() {
      return { transform: `rotate(${this.directionNum}deg)` };
    },
  },
};
</script>

<style lang="scss" scoped>
.highlights-wrap {
  position: relative;
  width: 100%;
  flex: 0 0 100%;
  max-width: 100%;
}

.highlight {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 14px;
  background: $primary;
  color: $white;
  padding: 24px 50px;

  .no-display {
    display: none !important;
  }

  .value {
    font-size: 64px;
    font-weight: 700;
    margin: 0 0 20px;
    text-align: center;

    span {
      font-size: 36px;
      font-weight: 500;
    }
  }

  .direction {
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.3);
      margin-right: 18px;
      border-radius: 100%;
      font-size: 16px;
    }

    p {
      font-size: 14px;
    }
  }

  .percent {
    width: 100%;

    .legend {
      display: flex;
      justify-content: space-between;
    }

    .bar-wrap {
      position: relative;
      margin: 4px 0;

      .bar-bg {
        width: 100%;
        height: 8px;
        background: $white;
        border-radius: 80px;
      }

      .bar-color {
        position: absolute;
        top: 0;
        height: 8px;
        background: #ffec65;
        border-top-left-radius: 80px;
        border-bottom-left-radius: 80px;
      }
    }

    p {
      margin: 0;
      float: right;
    }
  }
}

@media (min-width: 1200px) {
  .highlights-wrap {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
