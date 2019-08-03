<template>
  <div class="slide-wrap">
    <button class="prev" v-if="button" @click="arrow(-1)"></button>
    <button class="next" v-if="button" @click="arrow(1)"></button>
    <div class="slide">
      <slot/>
    </div>
    <ol class="pagination" v-if="pagination">
      <li v-for="index in length" :class="{'active': index-1 === currentIndex}"></li>
    </ol>
  </div>
</template>

<script>
  export default {
    name: 'UiSlider',
    props: {
      index: {
        type: Number,
        default: 0,
      },
      button: {
        type: Boolean,
        default: true,
      },
      full: {
        type: Boolean,
        default: false,
      },
      infinite: {
        type: Boolean,
        default: true,
      },
      duration: {
        type: Number,
        default: 700,
      },
      pagination: {
        type: Boolean,
        default: true,
      },
      change: {
        type: Function,
      },
    },
    data() {
      return {
        currentIndex: this.index,
        type: '',
        ea: '',
        limit: '',
        time: '',
        start: '',
        end: '',
        fake: null,
      };
    },
    computed: {
      length() {
        return this.$slots.default.length;
      },
    },
    methods: {
      ease(t) {
        return t > 0.5 ? 4 * Math.pow((t - 1), 3) + 1 : 4 * Math.pow(t, 3);
      },
      step() {
        if (this.start === undefined) {
          this.action(this.position(this.currentIndex));
          return false;
        }
        if (this.fake === 'last') {
          const zero = +this.position(this.length - 1);
          let d = +this.start - zero;
          while (+d - +this.ea > -this.limit) {
            d += this.limit;
          }
          this.start = +this.position(-1) + d;
          this.fake = null;
        }
        if (this.fake === 'first') {
          const zero = +this.position(0);
          let d = +this.start - zero;
          while (+d + +this.ea < this.limit) {
            d -= this.limit;
          }
          this.start = +this.position(this.length) + d;
          this.fake = null;
        }
        const time = (new Date() - this.time) / this.duration;
        const progress = -(-+this.end + +this.start);
        this.action(+this.start + (progress * this.ease(time)));
        if (time < 1) {
          requestAnimationFrame(this.step);
        } else {
          this.action(this.position(this.currentIndex));
        }
      },
      position(d) {
        let result = 0;
        switch (this.type) {
          case 1:
            result = Number(-100 * d / this.length);
            break;
          case 2:
            result = Number(-100 * d / this.length / 2);
            break;
          case 3:
            result = Number(-100 * (d + this.length) / this.length / 3);
            break;
          case 4:
            result = Number(-100 * (d + this.length) / this.length / 4);
            break;
        }
        return result;
      },
      action(number) {
        this.$el.childNodes[ 2 ].style.transform = 'translateX(' + number + '%)';
        this.$el.childNodes[ 2 ].dataset.number = number;
      },
      move(index) {
        this.currentIndex = index;
        this.time = new Date();
        this.start = this.$el.childNodes[ 2 ].dataset.number;
        this.end = this.position(this.currentIndex);
        this.step();
        if (this.pagination) {
          this.page(this.currentIndex);
        }
        if (this.change) {
          this.callback(this.currentIndex);
        }
      },
      page(index) {
        const active = this.$el.childNodes[ 3 ].querySelector('.active');
        if (active) {
          active.classList.remove('active');
        }
        this.$el.childNodes[ 3 ].childNodes[ index ].classList.add('active');
      },
      arrow(direct) {
        let index = this.currentIndex + direct;
        this.fake = null;
        if (index < 0) {
          index = this.length - 1;
          if (this.infinite) {
            this.fake = 'first';
          }
        }
        if (index > this.length - 1) {
          index = 0;
          if (this.infinite) {
            this.fake = 'last';
          }
        }
        this.move(index);
      },
    },
    mounted() {
      if (this.infinite) {
        if (this.full) {
          this.type = 3;
        } else {
          this.type = 4;
        }
      } else {
        if (this.full) {
          this.type = 1;
        } else {
          this.type = 2;
        }
      }
      let width = '';
      switch (this.type) {
        case 1:
          width = this.length * 100 + '%';
          break;
        case 2:
          width = 2 * 100 + '%';
          break;
        case 3:
          width = this.length * 3 * 100 + '%';
          break;
        case 4:
          width = 4 * 100 + '%';
          break;
      }
      this.$el.childNodes[ 2 ].style.width = width;
      for (let i = 1; i < this.type; i++) {
        for (let j = 0; j < this.length; j++) {
          const clone = this.$el.childNodes[ 2 ].childNodes[ j ].cloneNode(true);
          this.$el.childNodes[ 2 ].append(clone);
        }
      }
      this.ea = this.position(-(this.length - 1));
      this.limit = this.ea * this.length;
      this.move(this.currentIndex);
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .slide-wrap {
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .slide {
    display: flex;
    height: 100%;
  }

  .slide > * {
    flex: 1;
  }

  .next {
    z-index: 2;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    border: 0;
    background: 0;
  }

  .next:before {
    display: block;
    width: 30px;
    height: 30px;
    transform: rotate(-45deg);
    border: 3px solid #fff;
    border-top: 0;
    border-left: 0;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
    content: '';
  }

  .prev {
    z-index: 2;
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    border: 0;
    background: 0;

  }

  .prev:before {
    display: block;
    width: 30px;
    height: 30px;
    transform: rotate(45deg);
    border: 3px solid #fff;
    border-top: 0;
    border-right: 0;
    box-shadow: -1px 1px 1px rgba(0, 0, 0, .5);
    content: '';
  }

  .pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    text-align: center;
    list-style: none;
    font-size: 0;
  }

  .pagination li {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin: 6px 2px;
    border-radius: 7px;
    opacity: .5;
    transition: opacity .3s, width 1s;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
    cursor: pointer;
    background: #fff;
  }

  .pagination li.active {
    width: 21px;
    opacity: 1;
  }
</style>