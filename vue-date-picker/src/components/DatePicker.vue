<template>
  <div class="wrapper-outside">
    <div
      class="dp__input__wrapper"
      :class="disable ? 'disabled' : ''"
      @click="openDatePickerPopover = !openDatePickerPopover"
      @click.stop
    >
      <input readonly class="dp__input" :placeholder="title" :value="selectedDayValue" />
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <path
            d="M16 2a1 1 0 0 1 .993.883L17 3l-.001 1H18a3 3 0 0 1 2.995 2.824L21 7v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1.993-.117L9 3v1h5.999L15 3a1 1 0 0 1 1-1zm3 9H5v7a1 1 0 0 0 .883.993L6 19h12a1 1 0 0 0 1-1v-7zm-1-5H6a1 1 0 0 0-1 1v2h14V7a1 1 0 0 0-.883-.993L18 6z"
            fill="#C7C7C7"
          />
        </g>
      </svg>
    </div>
    <div class="dp__wrapper">
      <div class="dp__container noselect" v-if="openDatePickerPopover" @click.stop>
        <div class="btn__wrapper">
          <span class="btn_prev" @click="prevMonth()"
            ><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path
                  d="M13.586 6a1 1 0 0 1 1.497 1.32L15 7.414 10.415 12 15 16.586a1 1 0 0 1 .083 1.32L15 18a1 1 0 0 1-1.32.083L13.586 18l-5.293-5.293a1 1 0 0 1-.083-1.32l.083-.094L13.586 6z"
                  fill="#424242"
                />
              </g>
            </svg>
          </span>
          <div class="btn_monthSelection" @click="openMonths = !openMonths">
            <span v-if="!openMonths">{{ months[selectedMonth].title }} &nbsp; </span>
            <span>{{ selectedYear }}</span>
          </div>
          <span class="btn_next" @click="nextMonth()">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path
                  d="M10.417 6.005a1 1 0 0 0-1.497 1.32l.083.094L13.585 12l-4.582 4.57a1 1 0 0 0-.083 1.32l.083.094a1 1 0 0 0 1.32.083l.094-.083 5.29-5.277a1 1 0 0 0 .083-1.32l-.083-.094-5.29-5.288z"
                  fill="#424242"
                />
              </g>
            </svg>
          </span>
        </div>
        <div class="dp__calendar month" v-if="openMonths">
          <span
            v-for="(item, index) in months"
            :key="index + 'm1'"
            class="dp__calendar__month--item"
            :class="index === selectedMonth ? 'selected' : ''"
            @click="setSelectedMonth(index)"
            >{{ item.title }}</span
          >
        </div>
        <div class="dp__calendar days" v-if="!openMonths">
          <span v-for="item in daysOfWeek" :key="item + 'w1'" class="dp__calendar__day week">{{ item }}</span>

          <span
            v-for="item in prevDaysForPrevMonth(setTimestamp(1, selectedMonth + 1, selectedYear))"
            :key="item + 'mm1'"
            class="dp__calendar__day prev"
          >
          </span>

          <div
            v-for="item in daysInMonth(selectedMonth + 1, selectedYear)"
            :key="item + 'd1'"
            @click="handleSelect(item, selectedMonth + 1, selectedYear)"
            @[eventType.mousedown]="handleDown($event, setTimestamp(item, selectedMonth + 1, selectedYear))"
            @[eventType.mouseup]="handleUp($event, setTimestamp(item, selectedMonth + 1, selectedYear))"
            @mouseover="selectable(setTimestamp(item, selectedMonth + 1, selectedYear))"
            class="dp__calendar__day"
            :class="[
              findBetweenEnd(setTimestamp(item, selectedMonth + 1, selectedYear)) ? 'maySelect' : null,
              setStartDayClass(setTimestamp(item, selectedMonth + 1, selectedYear)) ? 'start' : null,
              setEndDayClass(setTimestamp(item, selectedMonth + 1, selectedYear)) ? 'end' : null,
              setSelectedDayClass(setTimestamp(item, selectedMonth + 1, selectedYear)) ? 'selected' : null,
              setMultipleDayClass(setTimestamp(item, selectedMonth + 1, selectedYear)) ? 'selected' : null,
              setDisableDates(setTimestamp(item, selectedMonth + 1, selectedYear)) ? 'disabled' : null,
            ]"
          >
            <span class="dp__calendar__day-item">
              {{ item }}
            </span>
          </div>
        </div>
        <div class="btn__wrapper bottom" v-if="multipleDrag" @click="approveSelection">
          <span class="btn_select">Select</span>
        </div>
      </div>

      <div class="dp__container noselect" v-if="openDatePickerPopover && range" @click.stop>
        <div class="btn__wrapper">
          <span class="btn_prev" @click="prevMonthEnd()">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path
                  d="M13.586 6a1 1 0 0 1 1.497 1.32L15 7.414 10.415 12 15 16.586a1 1 0 0 1 .083 1.32L15 18a1 1 0 0 1-1.32.083L13.586 18l-5.293-5.293a1 1 0 0 1-.083-1.32l.083-.094L13.586 6z"
                  fill="#424242"
                />
              </g>
            </svg>
          </span>
          <div class="btn_monthSelection" @click="openMonths = !openMonths">
            <span v-if="!openMonths">{{ months[selectedEndMonth].title }} &nbsp; </span>
            <span>{{ selectedEndYear }}</span>
          </div>
          <span class="btn_next" @click="nextMonthEnd()">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path
                  d="M10.417 6.005a1 1 0 0 0-1.497 1.32l.083.094L13.585 12l-4.582 4.57a1 1 0 0 0-.083 1.32l.083.094a1 1 0 0 0 1.32.083l.094-.083 5.29-5.277a1 1 0 0 0 .083-1.32l-.083-.094-5.29-5.288z"
                  fill="#424242"
                />
              </g>
            </svg>
          </span>
        </div>
        <div class="dp__calendar month" v-if="openMonths">
          <span
            v-for="(item, index) in months"
            :key="index + 'm2'"
            class="dp__calendar__month--item"
            :class="index === selectedEndMonth ? 'selected' : ''"
            @click="setSelectedEndMonth(index)"
            >{{ item.title }}</span
          >
        </div>
        <div class="dp__calendar days" v-if="!openMonths">
          <span v-for="item in daysOfWeek" :key="item + 'w2'" class="dp__calendar__day week">{{ item }}</span>

          <span
            v-for="item in prevDaysForPrevMonth(setTimestamp(1, selectedEndMonth + 1, selectedEndYear))"
            :key="item + 'mm2'"
            class="dp__calendar__day prev"
          >
          </span>

          <div
            v-for="item in daysInMonth(selectedEndMonth + 1, selectedEndYear)"
            :key="item + 'd2'"
            @click="handleSelect(item, selectedEndMonth + 1, selectedEndYear)"
            @[eventType.mousedown]="handleDown($event, item)"
            @[eventType.mouseup]="handleUp($event, item)"
            @mouseover="selectable(setTimestamp(item, selectedEndMonth + 1, selectedEndYear))"
            class="dp__calendar__day"
            :class="[
              findBetweenEnd(setTimestamp(item, selectedEndMonth + 1, selectedEndYear)) ? 'maySelect' : null,
              setStartDayClass(setTimestamp(item, selectedEndMonth + 1, selectedEndYear)) ? 'start' : null,
              setEndDayClass(setTimestamp(item, selectedEndMonth + 1, selectedEndYear)) ? 'end' : null,
              setDisableDates(setTimestamp(item, selectedEndMonth + 1, selectedEndYear)) ? 'disabled' : null,
            ]"
          >
            <span class="dp__calendar__day-item">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatePickerV2",
  props: {
    range: {
      type: Boolean,
      default: false,
    },
    multipleDrag: {
      type: Boolean,
      default: false,
    },
    maxDate: {
      type: [String, Number, Date],
    },
    minDate: {
      type: [String, Number, Date],
    },
    disable: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "Tarih Seçiniz",
    },
  },
  methods: {
    handleSelect(day, month, year) {
      const date = this.setTimestamp(day, month, year);
      if (this.range) {
        this.handleSelectRange(date);
      } else if (this.multipleDrag) {
        this.handleMultipleDrag(date);
      } else {
        this.handleSingleSelect(date);
      }
    },
    handleSingleSelect(timestamp) {
      this.selectedDay = this.splitYearMonthDay(timestamp);
      this.selectedDayValue = this.formatDate(new Date(timestamp));
      this.openDatePickerPopover = !this.openDatePickerPopover;
      this.$emit("selectedValue", timestamp);
    },
    handleMultipleDrag() {},
    handleSelectRange(timestamp) {
      this.selectedRangeDates.push(timestamp);
      if (this.selectedRangeDates.length === 2) {
        this.selectedRangeDates = this.selectedRangeDates.sort((a, b) => a - b);
        this.startDay = this.splitYearMonthDay(this.selectedRangeDates[0]);
        this.endDay = this.splitYearMonthDay(this.selectedRangeDates[1]);
        this.selectedDayValue = `${this.formatDate(new Date(this.selectedRangeDates[0]))}~${this.formatDate(
          new Date(this.selectedRangeDates[1])
        )}`;
        this.openDatePickerPopover = !this.openDatePickerPopover;
        this.$emit("selectedValue", this.selectedRangeDates);
        this.selectedRangeDates = [];
      }
      if (this.selectedRangeDates.length === 1) {
        this.startDay = this.splitYearMonthDay(this.selectedRangeDates[0]);
        this.endDay = null;
      }
    },
    handleDown(e, item) {
      this.startDay = this.splitYearMonthDay(item);
      this.selectedRangeDates.push(item);
    },
    handleUp(e, item) {
      if (item !== this.dayWithTimeStamp.startDate) {
        const startEnd = {
          start: new Date(this.dayWithTimeStamp.startDate).getDate(),
          end: new Date(item).getDate(),
        };
        for (let i = startEnd.start; i <= startEnd.end; i++) {
          this.multipleDateSelected.push(this.setTimestamp(i, this.selectedMonth + 1, this.selectedYear));
        }
        this.startDay = null;
        this.endDay = null;
      } else {
        this.startDay = null;
        this.endDay = null;
        if (this.multipleDateSelected.includes(item)) {
          this.multipleDateSelected = this.multipleDateSelected.filter((addd) => addd !== item);
        } else {
          this.multipleDateSelected.push(item);
        }
      }
      this.multipleDateSelected = [...new Set(this.multipleDateSelected)];
    },
    selectable(date) {
      if (this.startDay && this.selectedRangeDates.length > 0) {
        this.endDay = this.splitYearMonthDay(date);
      }
    },
    approveSelection() {
      this.openDatePickerPopover = !this.openDatePickerPopover;
      this.$emit("selectedValue", this.multipleDateSelected);
      this.selectedRangeDates = [];
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    setDisableDates(date) {
      const timestamp = {
        max: new Date(this.maxDate).getTime(),
        min: new Date(this.minDate).getTime(),
      };
      return !!(timestamp.max <= date || timestamp.min >= date);
    },
    nextMonth() {
      if (this.openMonths) {
        this.selectedYear++;
        return;
      }
      if (this.selectedMonth === 11) {
        this.selectedYear++;
        this.selectedMonth = 0;
      } else {
        this.selectedMonth++;
      }
    },
    nextMonthEnd() {
      if (this.openMonths) {
        this.selectedEndYear++;
        return;
      }
      if (this.selectedEndMonth === 11) {
        this.selectedEndYear++;
        this.selectedEndMonth = 0;
      } else {
        this.selectedEndMonth++;
      }
    },

    prevMonth() {
      if (this.openMonths) {
        this.selectedYear--;
        return;
      }
      if (this.selectedMonth === 0) {
        this.selectedYear--;
        this.selectedMonth = 11;
      } else {
        this.selectedMonth--;
      }
    },
    prevMonthEnd() {
      if (this.openMonths) {
        this.selectedEndYear--;
        return;
      }
      if (this.selectedEndMonth === 0) {
        this.selectedEndYear--;
        this.selectedEndMonth = 11;
      } else {
        this.selectedEndMonth--;
      }
    },
    findBetweenEnd(item) {
      return !!(this.dayWithTimeStamp.startDate < item && this.dayWithTimeStamp.endDate > item);
    },
    splitYearMonthDay(dateStr) {
      const date = new Date(dateStr);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
      };
    },
    clickOutSide() {
      this.openDatePickerPopover = false;
    },
    setSelectedMonth(selection) {
      this.selectedMonth = selection;
      this.openMonths = false;
    },
    setSelectedEndMonth(selection) {
      this.selectedEndMonth = selection;
      this.openMonths = false;
    },
    setTimestamp(day, month, year) {
      return new Date(year, month - 1, day).getTime();
    },
    setStartDayClass(date) {
      if (this.dayWithTimeStamp.startDate) {
        return !!(date === this.dayWithTimeStamp.startDate);
      }
      return false;
    },
    setEndDayClass(date) {
      if (this.dayWithTimeStamp.endDate) {
        return !!(date === this.dayWithTimeStamp.endDate);
      }
      return false;
    },
    setSelectedDayClass(date) {
      if (this.dayWithTimeStamp.selectedDate) {
        return !!(date === this.dayWithTimeStamp.selectedDate);
      }
      return false;
    },
    setMultipleDayClass(date) {
      return this.multipleDateSelected.includes(date);
    },
    prevDaysForPrevMonth(timestamp) {
      const prevDays = new Date(timestamp).getDay();
      return prevDays !== 0 ? prevDays - 1 : 6;
    },
    padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    },
    formatDate(date) {
      return [this.padTo2Digits(date.getDate()), this.padTo2Digits(date.getMonth() + 1), date.getFullYear()].join("/");
    },
  },

  computed: {
    dayWithTimeStamp() {
      return {
        startDate: this.startDay
          ? new Date(this.startDay.year, this.startDay.month, this.startDay.day).getTime()
          : null,
        currentDate: new Date().getTime(),
        endDate: this.endDay ? new Date(this.endDay.year, this.endDay.month, this.endDay.day).getTime() : null,
        selectedDate: this.selectedDay
          ? new Date(this.selectedDay.year, this.selectedDay.month, this.selectedDay.day).getTime()
          : null,
      };
    },
  },
  created() {
    if (this.multipleDrag) {
      this.eventType.mousedown = "mousedown";
      this.eventType.mouseup = "mouseup";
    }
  },
  mounted() {
    window.document.getElementsByTagName("BODY")[0].addEventListener("click", this.clickOutSide);
  },
  beforeUnmount() {
    window.document.getElementsByTagName("BODY")[0].removeEventListener("click", this.clickOutSide);
  },
  data() {
    return {
      date: new Date(),
      selected: [],
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      selectedEndMonth: new Date().getMonth() + 1,
      selectedEndYear: new Date().getFullYear(),
      eventType: {
        mousedown: null,
        mouseup: null,
      },
      openMonths: false,
      months: [
        { title: "OCAK" },
        { title: "ŞUBAT" },
        { title: "MART" },
        { title: "NİSAN" },
        { title: "MAYIS" },
        { title: "HAZİRAN" },
        { title: "TEMMUZ" },
        { title: "AĞUSTOS" },
        { title: "EYLÜL" },
        { title: "EKİM" },
        { title: "KASIM" },
        { title: "ARALIK" },
      ],
      daysOfWeek: ["Pzt", "Sal", "Çar", "Per", "Cm", "Cmt", "Pz"],
      selectedRangeDates: [],
      selectedRangeObj: {},
      startDay: null,
      endDay: null,
      selectedDay: null,
      multipleDateSelected: [],
      openDatePickerPopover: false,
      selectedDayValue: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.dp {
  &__input {
    all: unset;
    width: 100%;
    font-size: 14px;
    color: #1f1f1f;
    margin-right: 10px;
    font-weight: normal;
    border: none;
    &__wrapper {
      border-radius: 6px;
      border: solid 1px #c7c7c7;
      padding: 12px 12px 12px 16px;
      display: flex;
      flex-direction: row;
      cursor: pointer;
      &.disabled {
        border: solid 1px #e0e0e0;
        background-color: #f5f5f5;
        color: #c7c7c7;
        pointer-events: none;
        input {
          color: #c7c7c7;
        }
      }
    }
  }
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    padding: 16px;
    background: #fff;
    @media screen and (max-width: 320px) {
      width: 100%;
      padding: 8px;
    }
    &.noselect {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  &__wrapper {
    position: absolute;
    display: flex;
    flex-direction: row;
    box-shadow: 0 3px 14px 2px rgba(31, 31, 31, 0.06), 0 8px 10px 1px rgba(31, 31, 31, 0.08),
      0 5px 5px -3px rgba(31, 31, 31, 0.06);
    z-index: 999;
    border-radius: 10px;
    @media screen and (max-width: 500px) {
      flex-wrap: wrap;
    }
    @media screen and (max-width: 320px) {
      width: 100%;
    }
  }
  &__calendar {
    display: grid;

    &.month {
      grid-template-columns: repeat(3, 90px);
      grid-template-rows: repeat(4, 48px);
      grid-gap: 6px;
      align-items: center;
      justify-content: center;
      transition: 0.5s ease;
      @media screen and (max-width: 320px) {
        grid-template-columns: repeat(3, 69.3px);
        grid-template-rows: repeat(4, 38px);
      }
    }
    &.days {
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(6, 1fr);
    }
    &__day {
      width: 40px;
      height: 40px;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #1f1f1f;
      @media screen and (max-width: 320px) {
        width: 30px;
        height: 30px;
      }
      &.week,
      &.prev {
        cursor: inherit;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.29;
        text-align: center;
        color: #b0b0b0;
        &:hover {
          background: none;
        }
      }
      &-item {
        z-index: 2;
      }
      &:hover {
        background: #e1f5fe;
        border-radius: 50%;
      }
      &.selected {
        border-radius: 50%;
        background-color: #4b8cfb;
        color: #fff;
      }
      &.disabled {
        color: #b0b0b0;
        cursor: default;
        pointer-events: none;
      }
      &.maySelect {
        background: #e5f2ff;
        color: #1f1f1f;
      }
      &.start {
        position: relative;
        border-radius: 50%;
        background-color: #4b8cfb;
        color: #fff;
        &:before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-top-left-radius: 50%;
          border-bottom-left-radius: 50%;
          background-color: #e5f2ff;
        }
        &:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #4b8cfb;
        }
      }
      &.end {
        position: relative;
        border-radius: 50%;
        background-color: #4b8cfb;
        color: #fff;
        &:before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
          background-color: #e5f2ff;
        }
        &:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #4b8cfb;
        }
      }
    }
    &__month {
      &--item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.29;
        text-align: center;
        color: #1f1f1f;
        cursor: pointer;
        margin-bottom: 6px;
        &:hover {
          border-radius: 4px;
          background-color: #e5f2ff;
        }
        &.selected {
          border-radius: 4px;
          background-color: #4b8cfb;
          color: white;
        }
      }
    }
    &__year {
      &--item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.29;
        text-align: center;
        color: #1f1f1f;
        cursor: pointer;
        margin-bottom: 6px;
        &:hover {
          border-radius: 4px;
          background-color: #e5f2ff;
        }
        &.selected {
          border-radius: 4px;
          background-color: #4b8cfb;
          color: white;
        }
      }
    }
  }
}
.btn {
  &__wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    &.bottom {
      justify-content: center;
      padding: 0;
      .btn_select {
        font-weight: 700;
        cursor: pointer;
        padding: 5px 15px;
        border-radius: 6px;
        &:hover {
          transform: scale(1.1);
          background-color: #4b8cfb;
          color: white;
        }
      }
    }
  }
  &_next,
  &_prev {
    font-weight: 700;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
  &_monthSelection {
    cursor: pointer;
    padding: 5px 15px;
    &:hover {
      background-color: #b0b0b0;
      border-radius: 4px;
      color: white;
    }
    span {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #313335;
    }
  }
}
.wrapper-outside {
  position: relative;
  text-align: left;
  width: 250px;
  @media screen and (max-width: 320px) {
    text-align: center;
    width: 100%;
  }
}
</style>
